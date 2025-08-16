// prisma/seed.ts
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const catalog: { name: string; tags: string[] }[] = [
	{
		name: "Design",
		tags: ["Logo", "Branding", "UI", "UX", "Wireframing", "Prototyping", "Illustration", "Typography", "Packaging", "Presentation Design"]
	},
	{
		name: "Web Development",
		tags: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "TypeScript", "Tailwind", "API Integration", "Performance"]
	},
	{
		name: "Mobile Development",
		tags: ["iOS", "Android", "React Native", "Flutter", "UI Kits", "Firebase", "Push Notifications", "App Store Setup", "CI/CD", "Testing"]
	},
	{
		name: "Music",
		tags: ["Guitar", "Piano", "Vocals", "Music Theory", "Mixing", "Mastering", "Beatmaking", "FL Studio", "Sound Design", "Recording"]
	},
	{
		name: "Cooking",
		tags: ["Baking", "Desserts", "Healthy Meals", "Meal Prep", "Vegan", "Grilling", "Sauces", "Soups", "Pasta", "Seafood"]
	},
	{
		name: "Photography",
		tags: ["Portrait", "Landscape", "Product", "Lightroom", "Photoshop", "Retouching", "Studio Lighting", "Street", "Wedding", "Drone"]
	},
	{
		name: "Marketing",
		tags: ["SEO", "Content", "SMM", "Ads", "Google Ads", "Facebook Ads", "Email Marketing", "Analytics", "Copywriting", "Brand Strategy"]
	},
	{
		name: "Writing & Editing",
		tags: ["Copywriting", "Technical Writing", "Editing", "Proofreading", "Blogging", "UX Writing", "Resume", "Scripts", "Stories", "Translation"]
	},
	{
		name: "Language Learning",
		tags: ["English", "German", "Spanish", "French", "Hebrew", "Speaking Practice", "Grammar", "Vocabulary", "Pronunciation", "IELTS/TOEFL"]
	},
	{
		name: "Fitness & Training",
		tags: ["Hypertrophy", "Strength", "Weight Loss", "Nutrition", "CrossFit", "Mobility", "Running", "Powerlifting", "Calisthenics", "Coaching"]
	},
	{
		name: "Yoga & Mindfulness",
		tags: ["Hatha", "Vinyasa", "Ashtanga", "Breathwork", "Meditation", "Flexibility", "Balance", "Prenatal", "Stress Relief", "Yoga Nidra"]
	},
	{
		name: "Business & Finance",
		tags: ["Business Plan", "Pitch Deck", "Accounting", "Excel", "Investing", "Personal Finance", "Startup", "Unit Economics", "SWOT", "Market Research"]
	},
	{
		name: "Data Science",
		tags: ["Python", "Pandas", "SQL", "Machine Learning", "Deep Learning", "Data Viz", "Statistics", "Jupyter", "NLP", "ETL"]
	},
	{
		name: "Web3 & Blockchain",
		tags: ["Solidity", "Smart Contracts", "DApps", "Wallets", "Tokens", "NFTs", "DeFi", "Auditing", "Gas Optimization", "Hardhat"]
	},
	{
		name: "DIY & Handcrafts",
		tags: ["Woodworking", "Sewing", "Knitting", "Leathercraft", "Pottery", "Origami", "Candle Making", "Soap Making", "Jewelry", "3D Printing"]
	},
	{
		name: "Gardening",
		tags: ["Indoor Plants", "Hydroponics", "Composting", "Irrigation", "Soil", "Pruning", "Vegetables", "Herbs", "Fruit Trees", "Pest Control"]
	},
	{
		name: "Home Repair",
		tags: ["Plumbing", "Electrical", "Painting", "Drywall", "Tiling", "Flooring", "Carpentry", "Tools", "Safety", "Estimation"]
	},
	{
		name: "Automotive",
		tags: ["Maintenance", "Detailing", "Diagnostics", "Tuning", "Audio", "Bodywork", "Tires", "Oil Change", "Brakes", "Suspension"]
	},
	{
		name: "Education & Tutoring",
		tags: ["Math", "Physics", "Chemistry", "Biology", "Programming", "Exam Prep", "Essay Help", "Study Skills", "Science Projects", "Logic"]
	},
	{
		name: "Video Production",
		tags: ["Shooting", "Lighting", "Audio", "Color Grading", "Editing", "Premiere Pro", "After Effects", "Motion Graphics", "Script", "Storyboard"]
	},
];

async function main() {
	for (const c of catalog) {
		const category = await prisma.category.upsert({
			where: {name: c.name},
			update: {},
			create: {name: c.name},
			select: {id: true},
		});
		
		if (c.tags.length) {
			await prisma.tag.createMany({
				data: c.tags.map((t) => ({name: t, categoryId: category.id})),
				skipDuplicates: true, // уважает @@unique([name, categoryId])
			});
		}
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log("Seed OK");
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
