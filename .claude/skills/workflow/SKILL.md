# Workflow

A skill for generating sample workflow automation structures that can be used to visualize or prototype automation platforms like Zapier, Make, or n8n.

## When to Use

Use this skill when the user requests:
- "Show me a sample workflow"
- "Create a workflow example"
- "Generate an automation workflow"
- "Give me workflow JSON"
- Examples of trigger-action automation patterns

## What It Generates

Returns a JSON structure containing workflow automation examples with:
- **Triggers**: Events that start a workflow (e.g., "New form submission", "New order")
- **Actions**: Operations performed in response (e.g., "Send email", "Create task")
- **Apps**: Real integration names from the Zapier ecosystem
- **Step relationships**: Each step links to its parent via `parentId`

## Data Structure

```json
[{
  "id": 1,
  "title": "Workflow name",
  "steps": [{
    "id": 1,
    "parentId": null,
    "type": "trigger",
    "title": "Trigger name",
    "app": "App name"
  }, {
    "id": 2,
    "parentId": 1,
    "type": "action",
    "title": "Action name",
    "app": "App name"
  }]
}]
```

### Field Descriptions

- **id** (workflow level): Unique identifier for the workflow
- **title**: Descriptive name for the workflow use case
- **steps**: Array of trigger and action steps
  - **id**: Unique identifier for the step (scoped to workflow)
  - **parentId**: ID of the step this one follows (null for triggers)
  - **type**: Either "trigger" or "action"
  - **title**: Descriptive name of what the step does
  - **app**: Name of the integration/service being used

### Step Linking Rules

1. **Triggers** always have `parentId: null` (they start the workflow)
2. **First action** has `parentId` equal to the trigger's ID
3. **Subsequent actions** link to the previous step's ID
4. **Branching**: Multiple steps can share the same `parentId` (parallel paths)

## Example Usage

```json
{
  "id": 1,
  "title": "Customer onboarding",
  "steps": [{
    "id": 1,
    "parentId": null,
    "type": "trigger",
    "title": "New customer signup",
    "app": "Stripe"
  }, {
    "id": 2,
    "parentId": 1,
    "type": "action",
    "title": "Create contact",
    "app": "HubSpot"
  }, {
    "id": 3,
    "parentId": 2,
    "type": "action",
    "title": "Send welcome email",
    "app": "Gmail"
  }]
}
```

## Customization

### Adding New Workflows

Add new workflow objects to the array in `example.json`:
- Assign unique IDs
- Use realistic app names from Zapier's directory
- Keep step counts between 3-6 for clarity
- Ensure parentId values create a valid sequence

### Common Apps & Triggers

**Sales & Marketing:**
- Gmail, Outlook, Mailchimp, HubSpot, Salesforce
- Triggers: New email, New contact, Form submission

**Customer Support:**
- Zendesk, Intercom, Front, Help Scout
- Triggers: New ticket, New conversation, Ticket updated

**Productivity:**
- Slack, Trello, Asana, Google Calendar, Notion
- Triggers: New message, New task, Event starting

**E-commerce:**
- Shopify, WooCommerce, Stripe, PayPal
- Triggers: New order, Payment received, Product updated

### Common Actions

- **Notifications**: Send email, Send Slack message, Send SMS
- **Data Management**: Create row, Update record, Add contact
- **Task Management**: Create task, Update ticket, Assign to user
- **Logic**: Filter, Path routing, Delay, Formatter
- **AI/Non-deterministic**: AI by Zapier (one-shot), Agents by Zapier (looping)
- **Custom Code**: Code by Zapier (JavaScript/Python)

### AI & Non-Deterministic Workflows

For workflows with variable inputs, variable outputs, or processes that are hard to encode as deterministic steps:

**AI by Zapier:**
- One-shot AI processing
- Use for: text generation, summarization, classification, extraction
- Takes input, processes with AI, returns single output
- Example actions: "Summarize text", "Generate response", "Extract data"

**Agents by Zapier:**
- Iterative AI processing in a loop
- Use for: multi-step reasoning, complex decision-making, autonomous task completion
- Can make multiple API calls, iterate on results, handle dynamic workflows
- Example actions: "Process with AI Agent", "Autonomous task completion", "Dynamic workflow execution"

**When to use which:**
- Use **AI by Zapier** when you need a single AI transformation or decision
- Use **Agents by Zapier** when the workflow requires multiple steps that can't be predetermined

### Code by Zapier

For custom integrations and complex data transformations:

**Code by Zapier:**
- Write custom JavaScript or Python code directly in workflows
- Use when there isn't an existing Zapier action for your needs
- More efficient and resilient for complex data transformations
- Full programmatic control over data processing

**Common use cases:**
- **Data transformation**: Complex parsing, formatting, or restructuring of data
- **Custom API calls**: Integrate with services that don't have Zapier apps
- **Business logic**: Calculations, validations, or conditional processing
- **Batch operations**: Process arrays of data or perform multiple operations
- **Data enrichment**: Combine multiple data sources or add computed fields

**When to use Code by Zapier:**
- Stock Zapier actions don't provide the needed transformation
- You need to make API calls to services without Zapier integrations
- Complex data manipulation requires loops, conditionals, or custom algorithms
- Multiple Zapier actions would be needed but a single code step is more efficient
- You need precise control over error handling or data validation

**Example actions:**
- "Transform data with JavaScript"
- "Run Python script"
- "Make custom API call"
- "Parse and restructure JSON"
- "Calculate custom metrics"

## Tips for Realistic Workflows

1. **Start specific**: Use detailed trigger names like "New high-value order" vs "New order"
2. **Logic steps**: Include routing/filtering actions (Paths by Zapier, Filter by Zapier)
3. **Multi-app flows**: Real workflows often use 3-4 different apps
4. **End with notification**: Many workflows conclude with a Slack/email notification
5. **Data enrichment**: Include steps that add context (Clearbit, Google Sheets lookup)

## References

- [Zapier App Directory](https://zapier.com/apps)
- [Zapier Templates](https://zapier.com/app/explore)
- Common workflow patterns for inspiration
