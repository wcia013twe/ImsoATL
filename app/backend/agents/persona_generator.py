"""
Persona generator for WiFi deployment impact simulation.

Generates realistic personas based on census tract demographic data
to simulate community reactions to new internet access.
"""

import json
import google.generativeai as genai
from typing import Dict, Any, List


class PersonaGenerator:
    """
    Generates detailed personas representing residents who would benefit
    from WiFi deployment using Gemini LLM.
    """

    def __init__(self, gemini_api_key: str):
        """
        Initialize the persona generator.

        Args:
            gemini_api_key: Google Gemini API key
        """
        if not gemini_api_key:
            raise ValueError("Gemini API key is required")

        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def generate_personas(
        self,
        site_data: Dict[str, Any],
        num_personas: int = 5
    ) -> Dict[str, Any]:
        """
        Generate personas for a given census tract/site.

        Args:
            site_data: Dictionary containing tract demographics
            num_personas: Number of personas to generate (default 5)

        Returns:
            Dictionary with personas and summary
        """
        # Extract demographic data
        tract_id = site_data.get('tract_id', 'Unknown')
        county = site_data.get('county', 'Florida')
        poverty_rate = site_data.get('poverty_rate', 25.0)
        total_population = site_data.get('total_population', 5000)
        no_internet_pct = site_data.get('no_internet_pct', 30.0)
        median_income = site_data.get('median_income', 35000)

        # Build prompt for Gemini
        prompt = self._build_persona_prompt(
            county=county,
            poverty_rate=poverty_rate,
            total_population=total_population,
            no_internet_pct=no_internet_pct,
            median_income=median_income,
            num_personas=num_personas
        )

        try:
            # Generate content
            response = await self.model.generate_content_async(prompt)
            result_text = response.text

            # Parse JSON response
            # Remove markdown code blocks if present
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()

            personas_data = json.loads(result_text)

            # Add metadata
            personas_data['site_name'] = county
            personas_data['tract_id'] = tract_id

            return personas_data

        except Exception as e:
            # Return fallback personas if generation fails
            return self._get_fallback_personas(county, tract_id)

    def _build_persona_prompt(
        self,
        county: str,
        poverty_rate: float,
        total_population: int,
        no_internet_pct: float,
        median_income: float,
        num_personas: int
    ) -> str:
        """
        Build the prompt for Gemini to generate personas.
        """
        prompt = f"""You are generating realistic personas representing residents in {county}, Florida who would benefit from new WiFi deployment.

DEMOGRAPHICS:
- Location: {county}, Florida
- Poverty Rate: {poverty_rate:.1f}%
- Population: {total_population:,}
- Without Internet Access: {no_internet_pct:.1f}%
- Median Household Income: ${median_income:,}

Generate {num_personas} detailed personas representing lower-income residents who currently lack reliable internet access. These are real people with authentic struggles and aspirations.

IMPORTANT GUIDELINES:
1. Create diverse personas (age, occupation, family situation)
2. Make them realistic and relatable (not stereotypical)
3. Focus on working-class and lower-income backgrounds
4. 90% should have very positive reactions, 10% can be positive but cautious
5. Show authentic daily struggles related to lack of internet
6. Demonstrate specific, concrete ways WiFi would improve their lives

Return ONLY valid JSON (no markdown, no extra text) in this EXACT format:

{{
  "personas": [
    {{
      "id": "1",
      "name": "Full Name",
      "age": 35,
      "occupation": "Job Title",
      "living_situation": "Brief description of housing and family (1 sentence)",
      "daily_routine": "Typical day activities and challenges (2-3 sentences)",
      "internet_needs": ["Specific need 1", "Specific need 2", "Specific need 3"],
      "reaction": {{
        "sentiment": "very_positive",
        "quote": "First-person quote expressing reaction (1-2 sentences)",
        "reasons": ["Specific reason 1", "Specific reason 2", "Specific reason 3"]
      }},
      "life_impact": "How WiFi will transform their daily life (2-3 sentences)"
    }}
  ],
  "summary": {{
    "overall_sentiment": "Brief summary of community reaction (1 sentence)",
    "key_impacts": ["Impact area 1", "Impact area 2", "Impact area 3"],
    "community_transformation": "How WiFi will transform this community (2 sentences)"
  }}
}}

Sentiment options: "very_positive", "positive", "neutral"

Make the personas feel real with specific details, authentic voices, and genuine emotional reactions."""

        return prompt

    def _get_fallback_personas(self, county: str, tract_id: str) -> Dict[str, Any]:
        """
        Return fallback personas if LLM generation fails.
        """
        return {
            "site_name": county,
            "tract_id": tract_id,
            "personas": [
                {
                    "id": "1",
                    "name": "Maria Rodriguez",
                    "age": 42,
                    "occupation": "Retail Worker",
                    "living_situation": "Single mother of three living in a mobile home",
                    "daily_routine": "Works two part-time jobs to make ends meet. Struggles to help kids with homework because they can't access online learning resources at home.",
                    "internet_needs": [
                        "Help children with online homework",
                        "Apply for better jobs online",
                        "Access telehealth appointments"
                    ],
                    "reaction": {
                        "sentiment": "very_positive",
                        "quote": "This is life-changing for my family. My kids won't fall behind in school anymore, and I can finally look for better job opportunities online.",
                        "reasons": [
                            "Children can complete homework assignments",
                            "Access to online job applications",
                            "Connect with family in other states"
                        ]
                    },
                    "life_impact": "Free WiFi means Maria's children can keep up with their classmates and access educational resources. She can also search for better-paying jobs and take online training courses during her limited free time."
                },
                {
                    "id": "2",
                    "name": "James Thompson",
                    "age": 67,
                    "occupation": "Retired Construction Worker",
                    "living_situation": "Lives alone in a small apartment on a fixed income",
                    "daily_routine": "Manages chronic health conditions and tries to stay connected with distant family. Currently relies on the library for internet access.",
                    "internet_needs": [
                        "Schedule doctor appointments online",
                        "Video call grandchildren",
                        "Order affordable prescriptions online"
                    ],
                    "reaction": {
                        "sentiment": "very_positive",
                        "quote": "I've been paying too much for medical visits that could be telehealth. This will let me see my grandkids' faces more often and manage my medications better.",
                        "reasons": [
                            "Access telehealth services from home",
                            "Save money on prescription orders",
                            "Stay connected with family"
                        ]
                    },
                    "life_impact": "James can now access telehealth services, saving expensive trips to doctors. He can video call his grandchildren weekly and order medications online at better prices, significantly improving his quality of life on a fixed income."
                },
                {
                    "id": "3",
                    "name": "Destiny Williams",
                    "age": 19,
                    "occupation": "Community College Student",
                    "living_situation": "Lives with grandmother in public housing while attending community college",
                    "daily_routine": "Juggles classes, part-time work, and studying. Often stays late at campus just to use WiFi for assignments.",
                    "internet_needs": [
                        "Complete online coursework at home",
                        "Research scholarship opportunities",
                        "Submit job applications"
                    ],
                    "reaction": {
                        "sentiment": "very_positive",
                        "quote": "I won't have to choose between working my evening shift and finishing homework anymore. This opens up so many opportunities for me.",
                        "reasons": [
                            "Can study from home instead of staying late on campus",
                            "More time for work and family",
                            "Access to online learning resources"
                        ]
                    },
                    "life_impact": "Destiny gains hours back in her day, allowing her to work more shifts while completing her degree. She can apply for scholarships and jobs from home, significantly improving her chances of economic mobility."
                },
                {
                    "id": "4",
                    "name": "Carlos Mendez",
                    "age": 31,
                    "occupation": "Restaurant Cook",
                    "living_situation": "Married with one child, renting a small house",
                    "daily_routine": "Works evening shifts at a restaurant. Wife works mornings cleaning houses. They struggle to coordinate schedules and manage bills without reliable internet.",
                    "internet_needs": [
                        "Pay bills online to avoid late fees",
                        "Find better-paying job opportunities",
                        "Help son with remote learning days"
                    ],
                    "reaction": {
                        "sentiment": "positive",
                        "quote": "This will help our family stay organized and save money. I can finally look for day shift work so I can see my son more.",
                        "reasons": [
                            "No more late fees from missing payment deadlines",
                            "Search for better job opportunities",
                            "Support son's education"
                        ]
                    },
                    "life_impact": "Carlos can now manage household finances online, saving money on late fees. Access to job boards helps him search for day-shift positions. His son can learn online when schools have remote days."
                },
                {
                    "id": "5",
                    "name": "Patricia Green",
                    "age": 55,
                    "occupation": "Home Health Aide",
                    "living_situation": "Widow living in a small apartment, supporting elderly mother",
                    "daily_routine": "Provides in-home care for elderly clients. Uses phone data for work coordination, which is expensive and unreliable.",
                    "internet_needs": [
                        "Access client schedules and health records",
                        "Take online certification courses",
                        "Video call to check on mother during work"
                    ],
                    "reaction": {
                        "sentiment": "very_positive",
                        "quote": "Internet access means I can advance my career and provide better care for my clients. I'll save $50 a month on phone data too.",
                        "reasons": [
                            "Professional development through online courses",
                            "Better coordination with healthcare teams",
                            "Save money on cellular data"
                        ]
                    },
                    "life_impact": "Patricia can take online certification courses to increase her wages as a home health aide. She saves on expensive phone data and can better coordinate patient care, improving both her career prospects and quality of service."
                }
            ],
            "summary": {
                "overall_sentiment": "The community overwhelmingly welcomes free WiFi as a transformative opportunity for economic mobility and quality of life.",
                "key_impacts": [
                    "Educational access for children and students",
                    "Healthcare access through telehealth",
                    "Economic opportunity through online job searching and training"
                ],
                "community_transformation": "Free WiFi deployment will bridge the digital divide for hundreds of families in this community. Students can complete homework, seniors can access telehealth, workers can find better jobs, and families can stay connected—fundamentally changing life opportunities for those who have been left behind in the digital economy."
            }
        }
