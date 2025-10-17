
import { z } from 'zod';

// Define the input schema
export const FindBlogSitesInputSchema = z.object({
  topic: z.string().min(2, { message: 'Please enter a topic or keyword.' }),
});
export type FindBlogSitesInput = z.infer<typeof FindBlogSitesInputSchema>;

// Define the output schema for a single blog
const BlogSchema = z.object({
    name: z.string().describe('The name of the blog.'),
    url: z.string().url().describe('The main URL of the blog.'),
    description: z.string().describe('A brief description of the blog.'),
});

// Define the output schema
export const FindBlogSitesOutputSchema = z.object({
  blogs: z.array(BlogSchema).describe('A list of relevant blogs found.'),
});
export type FindBlogSitesOutput = z.infer<typeof FindBlogSitesOutputSchema>;
