import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

export async function POST() {
  await connectDb();

  const mocks = [
    {
      title: "UI/UX Developer Intern",
      company: "TechCorp Solutions",
      description:
        "Design and implement responsive user interfaces using React, Tailwind CSS and modern UI libraries.",
      location: "Remote",
      stipend: "₹15k",
      skillsRequired: ["React", "Tailwind", "Figma"],
      lastDateToApply: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      postedBy: "admin@techcorp.com",
    },
    {
      title: "Node.js Developer",
      company: "InnovateTech",
      description:
        "Build scalable APIs and services using Node.js, Express, and MongoDB in an Agile environment.",
      location: "Hybrid",
      stipend: "₹20k",
      skillsRequired: ["Node.js", "Express", "MongoDB"],
      lastDateToApply: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      postedBy: "admin@innovatetech.com",
    },
    {
      title: "ML Engineer Intern",
      company: "DevWorks Inc",
      description:
        "Apply machine learning algorithms to solve real-world problems using Python and TensorFlow.",
      location: "On-site",
      stipend: "₹25k",
      skillsRequired: ["Python", "TensorFlow", "Data Analysis"],
      lastDateToApply: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      postedBy: "admin@devworks.com",
    },
  ];

  try {
    // Remove existing seeded entries with same titles to avoid duplicates
    const titles = mocks.map((m) => m.title);
    await Internship.deleteMany({ title: { $in: titles } });

    const created = await Internship.insertMany(mocks);
    return NextResponse.json({ inserted: created.length, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
