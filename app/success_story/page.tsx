"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Calendar, Users } from "lucide-react";

const STORIES = [
	{
		id: "s1",
		title: "From Zero to SDE Intern at TechCorp",
		student: "Riya Sharma",
		company: "TechCorp Solutions",
		role: "SDE Intern",
		date: "2025-07-12",
		excerpt: "I started with no internships. TalentBridge connected me to mentorship, mock interviews and finally an SDE internship at TechCorp.",
		content:
			`Joining TechCorp as an SDE intern was transformational. I used TalentBridge's mock interview feature and portfolio tips to sharpen my skills. During the internship I worked on a feature used by thousands of users and learned production-grade engineering practices. The mentorship was excellent and I received a return offer after 6 months.`,
	},
	{
		id: "s2",
		title: "Landing a Data Internship at InnovateTech",
		student: "Aman Gupta",
		company: "InnovateTech",
		role: "Data Analyst Intern",
		date: "2025-06-02",
		excerpt: "TalentBridge helped me craft my resume and gave interview practice which led to an internship in data analytics.",
		content:
			`The data internship at InnovateTech exposed me to real-world datasets and taught me how to build pipelines. TalentBridge's community reviews helped me choose the right team and prepare effectively for technical rounds.`,
	},
	{
		id: "s3",
		title: "Research Internship at QuantumAI: My Journey",
		student: "Arjun Patel",
		company: "QuantumAI",
		role: "Research Intern",
		date: "2025-05-20",
		excerpt: "I contributed to model research thanks to the connections I made through TalentBridge.",
		content:
			`At QuantumAI I worked with a small research team on cutting-edge models. TalentBridge's curated opportunities and alumni introductions were key to landing this role. The experience strengthened my research skills and led to publications.`,
		},
		{
			id: "s4",
			title: "A Year as an Intern at HealthSync: Real Healthcare Exposure",
			student: "Rahul Singh",
			company: "HealthSync",
			role: "Product Intern",
			date: "2025-04-18",
			excerpt: "Small team, high responsibility — lots to learn in healthcare product workflows.",
			content:
				`HealthSync gave me end-to-end exposure to healthcare product development. I participated in user research, feature scoping, and coordination with clinicians. The work can be fast-paced and expects you to learn domain knowledge quickly. Company culture was supportive, but sometimes resource-constrained.`,
			review: `Pros: Real responsibility, direct mentorship. Cons: Smaller team, limited structured onboarding. Advice: If you want hands-on impact and don't mind learning on the job, join.`,
			recommend: "Yes",
		},
		{
			id: "s5",
			title: "Working at RetailHub: Frontend Intern Experience",
			student: "Priya Nair",
			company: "RetailHub",
			role: "Frontend Intern",
			date: "2025-03-10",
			excerpt: "Built user-facing components and shipped features used in production.",
			content:
				`RetailHub has a fast-paced engineering team with clear release cycles. I worked on customer-facing modules and learned a lot about performance and accessibility. The team is large, so mentorship quality can vary by squad. Expect structured code reviews and good testing practices.`,
			review: `Pros: Large-scale product exposure, good processes. Cons: Can be siloed depending on team. Advice: Great for those wanting production experience; yes, join if you like structured engineering environments.`,
			recommend: "Yes",
		},
		{
			id: "s6",
			title: "GreenEnergy Labs — Research Intern Reflection",
			student: "Karan Verma",
			company: "GreenEnergy Labs",
			role: "Research Intern",
			date: "2025-02-25",
			excerpt: "Strong domain mentorship and meaningful project work in renewables.",
			content:
				`Working at GreenEnergy felt purpose-driven. The mentors were experienced and focused on long-term research outcomes. The pace was deliberate, and I learned experimental design and data collection. Compensation was decent for a research role.`,
			review: `Pros: Domain experts, mentorship, meaningful projects. Cons: Slower productization. Advice: Join if you care about research and real-world impact.`,
			recommend: "Yes",
		},
		{
			id: "s7",
			title: "My QA Internship at DevWorks Inc",
			student: "Neha Patel",
			company: "DevWorks Inc",
			role: "QA Intern",
			date: "2025-01-14",
			excerpt: "Hands-on testing and automation work in a compact team.",
			content:
				`DevWorks offers great exposure to the full testing lifecycle. I got to work on automation frameworks and manual testing strategies. The compensation is moderate but the practical learning is high. The team is small so you often wear many hats.`,
			review: `Pros: High learning, varied responsibilities. Cons: Modest pay and occasional long hours. Advice: Join if you want a steep learning curve and broader exposure.`,
			recommend: "Yes",
		},
		{
			id: "s8",
			title: "BuildRight — Construction Intern on-site Experience",
			student: "Sana Khan",
			company: "BuildRight",
			role: "Civil Intern",
			date: "2024-12-08",
			excerpt: "Site visits and hands-on civil engineering tasks gave me practical experience.",
			content:
				`BuildRight is great if you want on-site, practical civil engineering experience. I was part of site planning, survey work, and coordination with contractors. Safety practices were emphasized, and supervisors were experienced.`,
			review: `Pros: Practical site exposure, experienced supervisors. Cons: Site travel and long days. Advice: Join if you prefer hands-on fieldwork over desk roles.`,
			recommend: "Yes",
		},
		{
			id: "s9",
			title: "AgriNext — Field Research Internship",
			student: "Meera Desai",
			company: "AgriNext",
			role: "Field Research Intern",
			date: "2024-11-20",
			excerpt: "Field trips and practical exposure made this internship very rewarding.",
			content:
				`At AgriNext I learned how agricultural technology is applied in the field. The team valued practical insights and we often iterated quickly based on farmer feedback. The stipend was modest but the learning was excellent.`,
			review: `Pros: Ground-level impact, direct farmer interaction. Cons: Travel and field conditions can be tough. Advice: Join if you enjoy fieldwork and social impact.`,
			recommend: "Yes",
		},
		{
			id: "s10",
			title: "FinEdge Analytics — ML Intern Takeaways",
			student: "Swati Rao",
			company: "FinEdge Analytics",
			role: "ML Intern",
			date: "2024-10-05",
			excerpt: "Worked on modeling pipelines with strong mentorship from senior data scientists.",
			content:
				`FinEdge is an excellent place for ML internships if you want exposure to financial datasets and model production. The team reviews were constructive and the tooling is mature. Expect rigorous review cycles and domain-specific challenges.`,
			review: `Pros: Strong mentorship, mature tooling. Cons: High domain complexity. Advice: Join if you want production ML experience in finance.`,
			recommend: "Yes",
		},
		{
			id: "s11",
			title: "AeroDesigns — CAD & Engineering Internship",
			student: "Vikram Joshi",
			company: "AeroDesigns",
			role: "CAD Intern",
			date: "2024-09-12",
			excerpt: "Hands-on with aerospace components and experienced engineering mentors.",
			content:
				`AeroDesigns gives great exposure to precise engineering workflows. The learning is intensive and the review cycles are strict. I recommend this for those serious about aerospace design.`,
			review: `Pros: Highly skilled mentors, precision engineering exposure. Cons: Rigorous expectations. Advice: Join if you are committed to aerospace engineering; otherwise consider other options.`,
			recommend: "Yes",
		},
	];

export default function StudentsPage() {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<typeof STORIES[number] | null>(null);

	function openStory(story: typeof STORIES[number]) {
		setActive(story);
		setOpen(true);
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<main className="container mx-auto px-6 py-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold">Student Success Stories</h1>
					<p className="text-muted-foreground">Read journeys from students who secured internships or placements through TalentBridge.</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{STORIES.map((s) => (
						<Card key={s.id}>
							<CardHeader className="pb-3">
								<CardTitle>{s.title}</CardTitle>
								<CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
									<span className="font-medium">{s.student}</span>
									<span>•</span>
									<span className="truncate">{s.company} — {s.role}</span>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground mb-3">{s.excerpt}</div>

								<div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
									<div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> <span>Online</span></div>
									<div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> <span>{s.date}</span></div>
								</div>

								<div className="flex gap-2">
									<Button className="flex-1" onClick={() => openStory(s)}>Read story</Button>
									<Button variant="ghost" className="text-sm">Share</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Dialog open={open} onOpenChange={(val) => setOpen(val)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{active?.title}</DialogTitle>
						</DialogHeader>
						<div className="mt-2">
							<div className="text-sm text-muted-foreground mb-4">By <span className="font-medium">{active?.student}</span> • {active?.company} — {active?.role}</div>
							<div className="prose max-w-none text-sm">{active?.content}</div>
						</div>
						<DialogFooter>
							<Button onClick={() => setOpen(false)}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</main>
		</div>
	);
}

