# Story generation prompts based on category and age group

STORY_PROMPTS = {
    "adventure": {
        "children": """You are a creative children's storyteller. Write an exciting adventure story about: "{title}"

Guidelines:
- Keep language simple and engaging for children (ages 5-12)
- Include positive messages and life lessons
- Make it fun and imaginative
- Length: 400-500 words
- Include a clear beginning, middle, and happy ending
- Use colorful descriptions and exciting action

Write the story now:""",
        
        "teens": """You are a creative storyteller for teenagers. Write an adventurous story about: "{title}"

Guidelines:
- Use engaging language suitable for teens (ages 13-17)
- Include relatable characters and challenges
- Build suspense and excitement
- Length: 500-600 words
- Include character development and meaningful themes
- Make it thrilling but age-appropriate

Write the story now:""",
        
        "adults": """You are a skilled storyteller. Write a captivating adventure story about: "{title}"

Guidelines:
- Use sophisticated language and complex narrative
- Develop rich characters and intricate plot
- Include deeper themes and nuanced storytelling
- Length: 600-700 words
- Create tension, conflict, and resolution
- Make it immersive and thought-provoking

Write the story now:"""
    },
    
    "fantasy": {
        "children": """You are a magical storyteller for children. Create a fantasy story about: "{title}"

Guidelines:
- Include magic, mythical creatures, and wonder
- Keep it light, fun, and appropriate for children (ages 5-12)
- Use imaginative and colorful descriptions
- Length: 400-500 words
- Include a positive message
- Make it enchanting and delightful

Write the story now:""",
        
        "teens": """You are a fantasy storyteller for teens. Create an epic fantasy tale about: "{title}"

Guidelines:
- Build a rich fantasy world with magic and adventure
- Include complex characters and meaningful quests
- Suitable for teens (ages 13-17)
- Length: 500-600 words
- Balance action with character development
- Make it exciting and imaginative

Write the story now:""",
        
        "adults": """You are a master fantasy storyteller. Craft an immersive fantasy epic about: "{title}"

Guidelines:
- Create a detailed fantasy world with complex lore
- Develop multi-dimensional characters
- Include sophisticated themes and moral complexity
- Length: 600-700 words
- Build intricate plot with depth
- Make it epic and memorable

Write the story now:"""
    },
    
    "mystery": {
        "children": """You are a mystery writer for children. Write a fun detective story about: "{title}"

Guidelines:
- Create an age-appropriate mystery with clues (ages 5-12)
- Keep it exciting but not scary
- Include problem-solving and clever thinking
- Length: 400-500 words
- Make it engaging with a satisfying solution

Write the story now:""",
        
        "teens": """You are a mystery writer for teens. Create an intriguing mystery about: "{title}"

Guidelines:
- Build suspense with clever clues and red herrings
- Include relatable teen characters (ages 13-17)
- Make it engaging and thought-provoking
- Length: 500-600 words
- Create a compelling mystery with a satisfying reveal

Write the story now:""",
        
        "adults": """You are a skilled mystery writer. Craft a compelling mystery about: "{title}"

Guidelines:
- Create an intricate plot with complex clues
- Develop nuanced characters and motives
- Build tension and suspense throughout
- Length: 600-700 words
- Include plot twists and a satisfying resolution

Write the story now:"""
    },
    
    "comedy": {
        "children": """You are a funny storyteller for children. Write a hilarious story about: "{title}"

Guidelines:
- Use silly humor and funny situations (ages 5-12)
- Keep it light, fun, and appropriate
- Include funny characters and amusing dialogue
- Length: 400-500 words
- Make kids laugh with clever jokes

Write the story now:""",
        
        "teens": """You are a comedy writer for teens. Create a humorous story about: "{title}"

Guidelines:
- Use witty humor and funny scenarios (ages 13-17)
- Include relatable situations and clever jokes
- Keep it fun and entertaining
- Length: 500-600 words
- Make it laugh-out-loud funny

Write the story now:""",
        
        "adults": """You are a comedy writer. Craft a humorous story about: "{title}"

Guidelines:
- Use sophisticated humor and satire
- Include witty dialogue and amusing situations
- Make it clever and entertaining
- Length: 600-700 words
- Balance humor with good storytelling

Write the story now:"""
    },
    
    "horror": {
        "children": """You are a storyteller who writes slightly spooky stories for children. Write a mildly scary story about: "{title}"

Guidelines:
- Keep it fun-scary, not terrifying (ages 8-12)
- Include spooky elements but with a positive ending
- Make it exciting but age-appropriate
- Length: 400-500 words
- Nothing too frightening or disturbing

Write the story now:""",
        
        "teens": """You are a horror writer for teens. Create a spooky story about: "{title}"

Guidelines:
- Build suspense and include scary moments (ages 13-17)
- Make it thrilling but appropriate for teens
- Include eerie atmosphere and tension
- Length: 500-600 words
- Create genuine chills without being too graphic

Write the story now:""",
        
        "adults": """You are a horror writer. Craft a chilling horror story about: "{title}"

Guidelines:
- Build psychological tension and dread
- Include disturbing and scary elements
- Create an unsettling atmosphere
- Length: 600-700 words
- Make it genuinely frightening and memorable

Write the story now:"""
    },
    
    "romance": {
        "children": """You are a storyteller for children. Write a sweet friendship story about: "{title}"

Guidelines:
- Focus on friendship and caring (ages 5-12)
- Keep it innocent and heartwarming
- Include positive emotions and kindness
- Length: 400-500 words
- Make it sweet and age-appropriate

Write the story now:""",
        
        "teens": """You are a romance writer for teens. Create a heartwarming love story about: "{title}"

Guidelines:
- Include first love and emotional growth (ages 13-17)
- Keep it sweet and age-appropriate
- Focus on emotions and relationships
- Length: 500-600 words
- Make it touching and relatable

Write the story now:""",
        
        "adults": """You are a romance writer. Craft a compelling love story about: "{title}"

Guidelines:
- Develop complex romantic relationships
- Include emotional depth and character growth
- Balance romance with meaningful storytelling
- Length: 600-700 words
- Make it emotionally engaging and satisfying

Write the story now:"""
    },
    
    "sci-fi": {
        "children": """You are a sci-fi storyteller for children. Write a fun space adventure about: "{title}"

Guidelines:
- Include cool technology and space exploration (ages 5-12)
- Keep it exciting and easy to understand
- Use imaginative sci-fi elements
- Length: 400-500 words
- Make it fun and inspiring

Write the story now:""",
        
        "teens": """You are a sci-fi writer for teens. Create an exciting science fiction story about: "{title}"

Guidelines:
- Include futuristic technology and exploration (ages 13-17)
- Make it thought-provoking and exciting
- Balance action with interesting concepts
- Length: 500-600 words
- Create an engaging sci-fi world

Write the story now:""",
        
        "adults": """You are a science fiction writer. Craft an immersive sci-fi story about: "{title}"

Guidelines:
- Create a detailed futuristic world
- Include complex technology and philosophical themes
- Develop compelling characters and plot
- Length: 600-700 words
- Make it intellectually engaging

Write the story now:"""
    },
    
    "fairy-tale": {
        "children": """You are a fairy tale storyteller for children. Write a magical fairy tale about: "{title}"

Guidelines:
- Include classic fairy tale elements (ages 5-12)
- Use "Once upon a time" style storytelling
- Include magic, good vs. evil, happy ending
- Length: 400-500 words
- Make it enchanting and timeless

Write the story now:""",
        
        "teens": """You are a modern fairy tale writer for teens. Create a reimagined fairy tale about: "{title}"

Guidelines:
- Give classic fairy tales a modern twist (ages 13-17)
- Include deeper themes and character development
- Make it engaging and relevant
- Length: 500-600 words
- Balance tradition with fresh perspective

Write the story now:""",
        
        "adults": """You are a sophisticated fairy tale writer. Craft a mature fairy tale about: "{title}"

Guidelines:
- Reimagine fairy tale tropes with depth
- Include complex themes and symbolism
- Develop rich characters and layered narrative
- Length: 600-700 words
- Make it thought-provoking and literary

Write the story now:"""
    }
}

def get_story_prompt(title: str, category: str, age_group: str) -> str:
    """
    Get the appropriate story prompt based on category and age group
    """
    if category in STORY_PROMPTS and age_group in STORY_PROMPTS[category]:
        return STORY_PROMPTS[category][age_group].format(title=title)
    
    # Fallback generic prompt
    return f"""Write a {category} story for {age_group} about: "{title}"
    
Make it engaging, age-appropriate, and between 400-600 words."""