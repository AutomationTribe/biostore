# Agent Pipeline Documentation

## Overview

BioStore uses an AI agent pipeline to provide intelligent onboarding for new users. The pipeline runs automatically after signup and can be manually triggered via API.

## Pipeline Stages

### Stage 1: Profile Agent
**Purpose**: Load user profile data from database  
**Input**: `{ userId: string }`  
**Output**: `{ context: PipelineContext }`

Reads from Supabase `users` table and builds initial context object with:
- userId
- email
- username
- fullName
- creatorCategory

### Stage 2: Bio Agent
**Purpose**: Generate personalized bio using Claude  
**Input**: `{ context: PipelineContext }`  
**Output**: `{ bio: string, bioConfidence: number }`

Calls Claude API with prompt:
```
"You are a creative writer helping African creators craft compelling bios.
Generate a short, engaging bio (max 150 characters) for [user details].
The bio should be authentic, highlight unique value, and encourage clicks."
```

Returns generated bio and confidence score (0.7-0.95 based on stop_reason).

### Stage 3: Theme Agent
**Purpose**: Recommend color theme based on creator category  
**Input**: `{ context: PipelineContext, bio: string }`  
**Output**: `{ themeId: string, themeName: string, colors: object }`

Uses heuristic matching:
- **Music/Artists** → Vibrant theme (red, cyan, yellow)
- **Tech/Design/Developer** → Minimal theme (black, white, gray)
- **Travel/Lifestyle/Wellness** → Sunset theme (orange, yellow)
- **Business/Coach/Consultant** → Professional theme (dark blue, light blue)
- **Default** → Professional

Theme colors are predefined in `THEMES` constant.

### Stage 4: Suggestion Agent
**Purpose**: Recommend links to add to profile  
**Input**: `{ context: PipelineContext }`  
**Output**: `{ suggestedLinks: SuggestedLink[] }`

Suggests platform links based on category:
- **All creators**: Instagram, Twitter
- **Music**: Spotify, SoundCloud
- **Tech**: GitHub, Portfolio
- **Business**: LinkedIn, Newsletter
- **Other**: Instagram, Twitter

Each suggestion includes title, URL, icon, and category.

### Stage 5: Output Agent
**Purpose**: Assemble all agent outputs into final result  
**Input**: All previous outputs  
**Output**: `{ OnboardingResult }`

Returns completed onboarding with:
- userId
- username
- generatedBio
- selectedTheme (id, name, colors)
- suggestedLinks
- completedAt timestamp

## Usage

### Automatic Trigger (on Signup)
```typescript
// In signup API route
const user = await signup(supabase, input);
runOnboardingPipeline(user.id).catch(error => {
  console.error("Onboarding pipeline error:", error);
});
// Returns immediately, pipeline runs in background
```

### Manual Trigger
```bash
curl -X POST http://localhost:3000/api/agents/onboarding \
  -H "Content-Type: application/json" \
  -d '{ "userId": "user-id-here" }'
```

## Error Handling

Each agent can throw `AgentExecutionError` with:
- `agentName` - which agent failed
- `message` - what went wrong
- `originalError` - underlying error

If any agent fails:
1. Pipeline stops immediately
2. Error is propagated to caller
3. Caller logs error (in background tasks) or returns to user (in API)

## Environment Variables

Required for pipeline:
- `ANTHROPIC_API_KEY` - Claude API access
- `NEXT_PUBLIC_SUPABASE_URL` - Database
- `SUPABASE_SERVICE_ROLE_KEY` - Service access
- `NEXT_PUBLIC_APP_URL` - Base URL for suggestions

## Monitoring & Debugging

### Logs
Pipeline logs to console in development:
```
[ProfileAgent] Loaded user profile for [username]
[BioAgent] Generated bio: "[bio text]"
[ThemeAgent] Selected theme: professional
[SuggestionAgent] Generated 6 suggestions
[OutputAgent] Onboarding completed
```

### Metrics to Track
- Pipeline success rate
- Average execution time per stage
- Which themes are most selected
- Bio generation quality feedback

## Extending the Pipeline

### Adding a New Agent

1. Create agent file in `src/agents/newAgent.ts`:
```typescript
export async function newAgent(
  input: NewAgentInput
): Promise<NewAgentOutput> {
  try {
    // agent logic
  } catch (error) {
    throw new AgentExecutionError(
      "NewAgent",
      "Failed to process",
      error
    );
  }
}
```

2. Update `src/agents/types.ts` with input/output types

3. Update `src/agents/pipeline.ts`:
```typescript
const newResult = await newAgent({
  context,
  // other inputs
});
```

4. Update `outputAgent` to include new result

### Modifying Bio Generation

Edit `bioAgent.ts` prompt to change:
- Bio tone
- Maximum length
- Required information
- Emoji usage

Example for more professional tone:
```typescript
const prompt = `Generate a professional bio (max 150 chars)...`;
```

## Performance Considerations

- **Parallel Agents**: Currently sequential; can be parallelized where outputs don't depend on each other
- **Caching**: Consider caching Claude responses per category
- **Timeouts**: Claude API calls have ~30s timeout
- **Cost**: Each signup runs 1 Claude API call (~$0.003)

## Testing

Unit test template:
```typescript
import { bioAgent } from "@/agents/bioAgent";
import { PipelineContext } from "@/agents/types";

describe("bioAgent", () => {
  it("should generate bio for given context", async () => {
    const context: PipelineContext = { /* mock */ };
    const result = await bioAgent({ context });
    
    expect(result.bio).toBeDefined();
    expect(result.bioConfidence).toBeGreaterThan(0.7);
    expect(result.bio.length).toBeLessThanOrEqual(150);
  });

  it("should throw AgentExecutionError on API failure", async () => {
    await expect(bioAgent({
      context: { /* invalid */ }
    })).rejects.toThrow(AgentExecutionError);
  });
});
```
