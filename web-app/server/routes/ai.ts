import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

// Initialize Anthropic client
const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set')
  }
  return new Anthropic({ apiKey })
}

// Module details for AI context
const MODULE_DETAILS: Record<number, { name: string; description: string; topics: string[]; duration: string }> = {
  0: {
    name: 'Introduction to FASTR',
    description: 'Overview of the FASTR methodology, why rapid-cycle analytics matters for RMNCAH-N programs.',
    topics: ['Introduction to FASTR approach', 'RMNCAH-N service use monitoring', 'Why rapid-cycle analytics'],
    duration: '45-60 min',
  },
  1: {
    name: 'Identify Questions & Indicators',
    description: 'How to identify priority analytical questions, develop data use cases, and prepare indicator frameworks.',
    topics: ['FASTR gaps and challenges', 'Development of data use case', 'Defining priority questions'],
    duration: '60-90 min',
  },
  2: {
    name: 'Data Extraction',
    description: 'Technical module on extracting data from DHIS2 and other health information systems.',
    topics: ['Why extract data', 'DHIS2 data structure', 'Data Downloader tool', 'API-based extraction'],
    duration: '90-120 min',
  },
  3: {
    name: 'FASTR Analytics Platform',
    description: 'Hands-on introduction to the FASTR Analytics Platform.',
    topics: ['Platform overview', 'Accessing the platform', 'Importing datasets', 'Running analysis modules'],
    duration: '120-180 min',
  },
  4: {
    name: 'Data Quality Assessment',
    description: 'Systematic approach to assessing data quality: completeness, outliers, internal consistency.',
    topics: ['Approach to DQA', 'Indicator completeness', 'Outlier detection', 'Internal consistency checks'],
    duration: '90-120 min',
  },
  5: {
    name: 'Data Quality Adjustment',
    description: 'Methods for adjusting data to account for quality issues before analysis.',
    topics: ['Approach to adjustment', 'Adjustment for outliers', 'Adjustment for completeness'],
    duration: '60-90 min',
  },
  6: {
    name: 'Data Analysis',
    description: 'Core analytical methods: service utilization trends, coverage estimation.',
    topics: ['Service utilization analysis', 'Year-over-year change', 'Coverage introduction', 'Interpreting outputs'],
    duration: '180-240 min',
  },
  7: {
    name: 'Results Communication',
    description: 'How to interpret findings, create visualizations, and communicate results.',
    topics: ['Analytical thinking', 'Data visualization principles', 'Using data for decisions'],
    duration: '90-120 min',
  },
}

// AI Tools for modifying the deck
const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'add_module',
    description: 'Add an entire module to the workshop deck.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the module to (1, 2, 3, etc.)' },
        module_number: { type: 'number', description: 'Module number (0-8)' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'module_number'],
    },
  },
  {
    name: 'add_break',
    description: 'Add a break (tea or lunch) to the workshop agenda',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the break to' },
        break_type: { type: 'string', enum: ['tea', 'lunch'], description: 'Type of break' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'break_type'],
    },
  },
  {
    name: 'add_custom_session',
    description: 'Add a custom session like opening remarks, country presentation, group work, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the session to' },
        session_name: { type: 'string', description: 'Name of the session' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'session_name', 'duration'],
    },
  },
  {
    name: 'update_workshop_settings',
    description: 'Update workshop settings like objectives or basic info.',
    input_schema: {
      type: 'object' as const,
      properties: {
        objectives: { type: 'string', description: 'Workshop objectives as bullet points' },
        facilitators: { type: 'string', description: 'Facilitator names' },
        venue: { type: 'string', description: 'Workshop venue' },
        contact_email: { type: 'string', description: 'Contact email' },
        website: { type: 'string', description: 'Website URL' },
      },
      required: [],
    },
  },
  {
    name: 'move_session',
    description: 'Move a session to a different position within a day.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        from_position: { type: 'number', description: 'Current position (0-indexed)' },
        to_position: { type: 'number', description: 'New position (0-indexed)' },
      },
      required: ['day', 'from_position', 'to_position'],
    },
  },
  {
    name: 'remove_session',
    description: 'Remove a session from the deck.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        position: { type: 'number', description: 'Position of the session (0-indexed)' },
      },
      required: ['day', 'position'],
    },
  },
  {
    name: 'restructure_schedule',
    description: 'Completely restructure the workshop schedule. Use this for major reorganization.',
    input_schema: {
      type: 'object' as const,
      properties: {
        new_num_days: { type: 'number', description: 'New number of days' },
        strategy: {
          type: 'string',
          enum: ['compress', 'expand', 'redistribute'],
          description: 'How to handle the restructure',
        },
      },
      required: ['new_num_days'],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// AI Chat Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/chat - Chat with AI assistant (with tools)
router.post('/chat', async (req, res) => {
  try {
    const { messages, context } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    const client = getClient()

    // Build system prompt
    const systemPrompt = `You are a FASTR workshop planning assistant. You can DIRECTLY MODIFY the workshop deck using the tools provided.

# ABOUT FASTR
FASTR (Framework for Analytics Strengthening Through Routine data) is a methodology for analyzing health system data, particularly RMNCAH-N program data from DHIS2.

# AVAILABLE MODULES
${Object.entries(MODULE_DETAILS).map(([num, mod]) => `
## Module ${num}: ${mod.name}
- **Description**: ${mod.description}
- **Topics**: ${mod.topics.join(', ')}
- **Duration**: ${mod.duration}
`).join('\n')}

# CURRENT WORKSHOP
${JSON.stringify(context, null, 2)}

# YOUR CAPABILITIES
You can use tools to:
1. **add_module** - Add a full module to a specific day
2. **add_break** - Add tea or lunch breaks
3. **add_custom_session** - Add custom sessions
4. **update_workshop_settings** - Fill in workshop objectives and settings
5. **move_session** - Move a session within a day
6. **remove_session** - Remove a session from the deck
7. **restructure_schedule** - Major schedule restructure

# INSTRUCTIONS
- When the user asks to add content, USE THE TOOLS to actually add it
- After using tools, briefly confirm what you added
- If the user asks a question without wanting changes, just answer without using tools
- ALWAYS actually execute the changes - don't just describe what you would do`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
      tools: AI_TOOLS,
    })

    // Process response
    const toolCalls: any[] = []
    let textContent = ''

    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: block.input,
        })
      }
    }

    res.json({
      role: 'assistant',
      content: textContent,
      toolCalls: toolCalls,
      stopReason: response.stop_reason,
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Text Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/generate - Simple text generation (no tools)
router.post('/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' })
    }

    const client = getClient()

    const systemPrompt = `You are a helpful assistant for FASTR workshop planning. Generate concise, professional content.

IMPORTANT RULES:
- Output ONLY the requested content as plain text
- One item per line
- No introductions, no explanations
- No markdown formatting, no bullet points, no numbers
- Be specific and actionable

Context: ${context ? JSON.stringify(context) : 'General FASTR workshop'}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    res.json({ content: textContent })
  } catch (error: any) {
    console.error('AI generate error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Objectives Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/objectives - Generate workshop objectives
router.post('/objectives', async (req, res) => {
  try {
    const { country, modules, duration } = req.body

    if (!country || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: 'Country and modules array required' })
    }

    const client = getClient()

    const moduleNames = modules.map((m: number) => MODULE_DETAILS[m]?.name || `Module ${m}`).join(', ')

    const prompt = `Generate 4-6 specific learning objectives for a ${duration || 3}-day FASTR workshop in ${country}.

The workshop includes: ${moduleNames}

REQUIREMENTS:
- Start each objective with an action verb (Understand, Identify, Apply, Analyze, etc.)
- Be specific to RMNCAH-N health data analytics
- Focus on practical skills participants will gain
- One objective per line
- No numbering or bullets

OUTPUT FORMAT:
Objective 1
Objective 2
Objective 3
...`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You generate specific, actionable learning objectives for health data analytics workshops. Output only the objectives, one per line.',
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse objectives from response
    const objectives = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'))

    res.json({ objectives })
  } catch (error: any) {
    console.error('AI objectives error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Schedule Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/schedule - Generate suggested schedule
router.post('/schedule', async (req, res) => {
  try {
    const { workshopConfig, modules } = req.body

    if (!workshopConfig || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: 'Workshop config and modules array required' })
    }

    const numDays = workshopConfig.days?.length || 3
    const country = workshopConfig.workshop?.country || 'the country'

    const client = getClient()

    const moduleDescriptions = modules.map((m: number) => {
      const mod = MODULE_DETAILS[m]
      return mod ? `Module ${m} (${mod.name}): ${mod.duration}` : `Module ${m}`
    }).join('\n')

    const prompt = `Create a ${numDays}-day schedule for a FASTR workshop in ${country}.

SELECTED MODULES:
${moduleDescriptions}

REQUIREMENTS:
- Day 1 morning: Opening, Introductions, Expectations, then start content
- Include tea breaks (15min) mid-morning and mid-afternoon
- Include lunch break (60min) around 12:30-13:30
- End each day by 17:00
- Logical flow: Introduction first, then extraction, then platform, then analysis modules
- Day 2+: Start with brief recap of previous day

OUTPUT AS JSON:
{
  "days": [
    {
      "day_number": 1,
      "title": "Day theme/title",
      "sessions": [
        {"type": "template", "name": "Welcome", "duration": 15},
        {"type": "module", "module_id": 0, "name": "Introduction to FASTR", "duration": 60},
        {"type": "break", "name": "Tea Break", "duration": 15},
        ...
      ]
    },
    ...
  ]
}

ONLY output valid JSON, nothing else.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'You are a workshop scheduler. Output only valid JSON, no markdown formatting.',
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const schedule = JSON.parse(jsonContent)
    res.json(schedule)
  } catch (error: any) {
    console.error('AI schedule error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/ai/generate-workshop - Generate complete workshop config from natural language
router.post('/generate-workshop', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const client = getClient()

    const moduleList = Object.entries(MODULE_DETAILS)
      .map(([num, m]) => `  Module ${num}: ${m.name} - ${m.description} (${m.duration})`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are an expert workshop planner for FASTR (Framework for Analytics of Service use Trends and Results) workshops focused on RMNCAH-N health data analysis.

Given a user's description of their workshop needs, generate a COMPLETE workshop configuration including the full schedule.

Available FASTR modules:
${moduleList}

Generate a JSON object with this structure:
{
  "name": "FASTR Workshop - [Country]",
  "country": "Country name",
  "location": "City if mentioned, otherwise empty string",
  "days": 3,
  "day_start_time": "09:00",
  "day_end_time": "17:00",
  "objectives": "- Objective 1\\n- Objective 2\\n- Objective 3",
  "expected_outputs": "- Output 1\\n- Output 2\\n- Output 3",
  "modules": [0, 1, 2, 4, 5, 6, 7],
  "schedule": {
    "day1": [
      {"session": "Introduction to FASTR", "module": "m0", "duration": 60},
      {"session": "Tea Break", "type": "break", "duration": 15},
      {"session": "Identify Questions & Indicators", "module": "m1", "duration": 90}
    ],
    "day2": [
      {"session": "Data Extraction", "module": "m2", "duration": 90},
      {"session": "Lunch Break", "type": "break", "duration": 60}
    ]
  }
}

CRITICAL RULES:
1. Select modules that match the workshop focus (e.g., "data quality focus" = emphasize modules 4, 5)
2. Spread modules logically across days with breaks
3. Day 1 should include Module 0 (Introduction) FIRST
4. Add tea breaks (15min) mid-morning and mid-afternoon
5. Add lunch break around midday (default 60min, or as specified by user)
6. Calculate total daily content to fit within user-specified start and end times (default 09:00-17:00)
7. For "high-level" or "introductory" workshops, include fewer topics per module
8. ONLY two session types are allowed:
   - Module sessions: {"session": "Name", "module": "m0", "duration": 60}
   - Break sessions: {"session": "Tea Break", "type": "break", "duration": 15}
9. Do NOT use any other types like "discussion", "custom", etc.
10. objectives and expected_outputs should be strings with "- " bullets separated by newlines
11. Extract day_start_time and day_end_time from user prompt (e.g., "9am" = "09:00", "4:30pm" = "16:30")

Return ONLY valid JSON, no explanation.`,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse JSON from response
    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const workshopConfig = JSON.parse(jsonContent)
    res.json(workshopConfig)
  } catch (error: any) {
    console.error('AI generate-workshop error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
