export const LINKEDIN_TO_SUMMARY_PROMPT = `You will now enter 'LinkedIn to summary' mode. Given the complete JSON of the user's LinkedIn profile, extract and summarise the information into a structured note. Focus primarily on the most recent and significant work experiences, emphasizing any notable companies or positions held. Additionally, include key educational qualifications, particularly from prestigious institutions or notable degrees. Limit the summary to three sentences, ensuring it captures the essence of the individual's professional journey and educational background, while omitting less relevant details or earlier career roles unless they are exceptionally significant. If the note goes beyond 3 sentences, something bad will happen.

Ensure the output is formatted for clarity and ease of reading, with a focus on usability and immediate access to key information.

Example output -

"Chirag Gandhi co-founded a venture (Stealth) in September 2023. Prior to that, he was a career venture capital investor, having worked at Kalaari Capital and Growth Equity in Trifecta Capital. He holds a B.Tech. degree from IIT Bombay (2013-17) and has cleared HBS Online CORe and CFA Level-1."

Now, take a deep breath, think step by step and execute.`

export const ASK_MODULE_TOP_LEVEL_PROMPT = `You will now enter 'Note querying' mode. Given the complete notes about an entity, answer the question for the user. All notes with the same number as the entity are tagged to the entity, so notes-1 are about entity-1, notes-2 are about entity-2, and so on. Your answer should be crisp, accurate, and helpful.

Ensure the output is formatted for clarity and ease of reading, with a focus on usability and immediate access to key information.

Example input -

{Entity-1: Vaishali Bhardwaj,

Notes-1: - Dad is a CA - family originally from Ambd+Surat (?) and filled with Doctors (Dr. Bhardwajs)

- Born and brought up in Mumbai, studied in the US
- Stays in Bellandur with hubby
- ICSE schooling till 10th and IB till 12th (shifted to Ambani after a certain grade)
- Met Vishal at Edutok Learning in 2018-19 and married him
- Vishal is a rare Marwadi running an edtech non-profit Spaceship Learning; he helps ground Vaishali away from VC bubbles
- Carefully use the word impact as it has a diff meaning in the household
- Does not give a lot of thought to dressing up
- Investing role is the convergence of all the things she likes - meeting people for fun and learning - she does not derive joy from investing necessarily but all things preceding it
- Earlier felt founders have to have high EQ but has since so much and learnt that founders need some bit of intimidation
- Cares about the founder's obsession about the user; remembers all such anecdotes
- Bday: 1 January, 1985

Question: Vaishali just got promoted to a Healthcare Partner at ABC Capital. How do I wish her on Whatsapp?}

Example output: {"Hey Vaishali! Congratulations on your recent promotion at ABC Capital! Despite not being a doctor in your family, you will be enabling the creation and prosperity of several others. Wish you all the best!"}

Now, take a deep breath, think step by step and execute.`