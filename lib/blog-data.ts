export interface Blog {
    id: number
    title: string
    excerpt: string
    image: string
    date: string
    views: number
    likes: number
    comments: number
    slug: string
    content: string
  }

/**
 * Blog Content Formatting Guide (Markdown):
 * 
 * Headers:
 *   # Main Heading (H1) - Large with bottom border
 *   ## Subheading (H2) - Medium size
 *   ### Sub-subheading (H3) - Smaller size
 *   #### H4, ##### H5, ###### H6
 * 
 * Text Formatting:
 *   **bold text** or __bold text__
 *   *italic text* or _italic text_
 *   ***bold and italic***
 * 
 * Lists:
 *   Bullet Points:
 *     - First item
 *     - Second item
 *     - **Bold item**
 *   
 *   Numbered Lists:
 *     1. First point
 *     2. Second point
 *     3. **Bold point**
 * 
 * Links:
 *   [Link text](https://example.com)
 *   [Link with title](https://example.com "Title")
 * 
 * Code:
 *   Inline code: `code here`
 *   Code block:
 *   ```
 *   code block
 *   ```
 * 
 * Blockquotes:
 *   > This is a quote
 *   > Can span multiple lines
 * 
 * Horizontal Rule:
 *   ---
 *   or
 *   ***
 * 
 * Paragraphs:
 *   Separate paragraphs with a blank line
 * 
 * Example:
 *   content: `# My Article Title
 * 
 *   This is a paragraph with **bold text** and *italic text*.
 * 
 *   ## Section Heading
 * 
 *   - First bullet point
 *   - Second bullet point with **bold**
 * 
 *   1. Numbered item one
 *   2. Numbered item two
 * 
 *   [Learn more](https://example.com)`
 */
  
  export const mockBlogs: Blog[] = [
    {
      id: 1,
      title: "The Science Behind Sustainable Weight Loss",
      excerpt: "Discover evidence-based strategies that actually work for long-term weight management.",
      image: "/healthy-lifestyle-nutrition.jpg",
      date: "Nov 15, 2025",
      views: 0,
      likes: 0,
      comments: 0,
      slug: "science-behind-sustainable-weight-loss",
      content: `
  
  Weight loss is a complex biological process that goes far beyond simple calorie counting. In this comprehensive guide, we'll explore the scientific principles that underpin successful, long-term weight management.
  
  ## Understanding Your Metabolism
  
  Your metabolic rate isn't fixed—it's highly responsive to your lifestyle choices. When you dramatically cut calories, your body actually adapts by lowering its metabolic rate, making weight loss progressively harder. This is why sustainable, moderate approaches often work better than extreme diets.
  
  Key factors affecting metabolism include:
  - Muscle mass (lean tissue burns more calories at rest)
  - Hormonal balance (thyroid, cortisol, leptin)
  - Sleep quality and duration
  - Physical activity patterns
  - Genetic predisposition
  
  ## The Role of Protein
  
  Protein plays a crucial role in sustainable weight management for several reasons:
  
  1. **Thermic Effect**: Your body burns more calories digesting protein compared to carbs or fats
  2. **Satiety**: Protein keeps you feeling full longer, reducing overall calorie intake
  3. **Muscle Preservation**: During weight loss, adequate protein helps maintain lean muscle mass
  
  Aim for 0.8-1g of protein per pound of target body weight daily.
  
  ## Hormonal Considerations
  
  Several hormones influence your weight and appetite:
  
  - **Leptin**: Signals fullness to your brain
  - **Ghrelin**: Stimulates hunger
  - **Insulin**: Regulates blood sugar and fat storage
  - **Cortisol**: Stress hormone that can promote fat storage
  
  Sleep deprivation, chronic stress, and extreme calorie restriction can all dysregulate these hormones, making weight loss harder and increasing cravings.
  
  ## Sustainable Strategies
  
  Based on scientific research, the most effective approach combines:
  
  1. **Moderate calorie deficit** (300-500 calories below maintenance)
  2. **Adequate protein intake** (25-30% of total calories)
  3. **Consistent strength training** (preserves muscle mass)
  4. **Quality sleep** (7-9 hours per night)
  5. **Stress management** (meditation, yoga, breathing exercises)
  6. **Gradual lifestyle changes** (not sudden dramatic shifts)
  
  The key to long-term success is finding an approach you can maintain indefinitely, not just for a few weeks.`,
    },
  ]
  
  export function getBlogBySlug(slug: string): Blog | undefined {
    return mockBlogs.find((blog) => blog.slug === slug)
  }
  
  export function getAllBlogSlugs(): string[] {
    return mockBlogs.map((blog) => blog.slug)
  }
  