"use client";

import { Header } from "@/components/header";
import { Building, Globe, Users, MapPin, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Partner Companies</h1>
          <p className="text-muted-foreground">Explore companies that post internships on TalentBridge</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(
            // Expanded static list of partner companies
            [
              {
                id: 'c1',
                name: 'TechCorp Solutions',
                industry: 'Technology',
                location: 'Bangalore',
                size: '201-500',
                rating: 4.3,
                reviews: [
                  { student: 'Riya Sharma', role: 'Intern - SDE', text: 'Great mentorship and hands-on projects. Got real ownership of tasks.' },
                ],
              },
              {
                id: 'c2',
                name: 'InnovateTech',
                industry: 'Software',
                location: 'Mumbai',
                size: '51-200',
                rating: 4.0,
                reviews: [
                  { student: 'Aman Gupta', role: 'Intern - Data Analyst', text: 'Exposure to production datasets. Friendly team and good stipend.' },
                ],
              },
              {
                id: 'c3',
                name: 'DevWorks Inc',
                industry: 'IT Services',
                location: 'Delhi',
                size: '11-50',
                rating: 3.8,
                reviews: [
                  { student: 'Neha Patel', role: 'Intern - QA', text: 'Learned testing best practices; smaller company but lots of responsibility.' },
                ],
              },
              {
                id: 'c4',
                name: 'GreenEnergy Labs',
                industry: 'Renewables',
                location: 'Pune',
                size: '51-200',
                rating: 4.6,
                reviews: [
                  { student: 'Karan Verma', role: 'Intern - Research', text: 'Amazing domain exposure and supportive mentors in renewable tech.' },
                ],
              },
              {
                id: 'c5',
                name: 'FinEdge Analytics',
                industry: 'Finance',
                location: 'Bangalore',
                size: '201-500',
                rating: 4.1,
                reviews: [
                  { student: 'Swati Rao', role: 'Intern - ML', text: 'Challenging problems and real impact on models used in prod.' },
                ],
              },
              {
                id: 'c6',
                name: 'HealthSync',
                industry: 'Healthcare',
                location: 'Chennai',
                size: '1-10',
                rating: 3.9,
                reviews: [
                  { student: 'Rahul Singh', role: 'Intern - Product', text: 'Small team, broad responsibilities, great learning curve.' },
                ],
              },
              {
                id: 'c7',
                name: 'RetailHub',
                industry: 'E-commerce',
                location: 'Mumbai',
                size: '501-1000',
                rating: 4.2,
                reviews: [
                  { student: 'Priya Nair', role: 'Intern - Frontend', text: 'Built customer-facing features and got continued guidance.' },
                ],
              },
              {
                id: 'c8',
                name: 'AeroDesigns',
                industry: 'Aerospace',
                location: 'Hyderabad',
                size: '201-500',
                rating: 4.5,
                reviews: [
                  { student: 'Vikram Joshi', role: 'Intern - CAD', text: 'Hands-on with real aerospace components; experienced engineers as mentors.' },
                ],
              },
              {
                id: 'c9',
                name: 'AgriNext',
                industry: 'Agriculture',
                location: 'Ahmedabad',
                size: '11-50',
                rating: 4.0,
                reviews: [
                  { student: 'Meera Desai', role: 'Intern - Field Research', text: 'Field trips and practical exposure made the internship very rewarding.' },
                ],
              },
              {
                id: 'c10',
                name: 'QuantumAI',
                industry: 'AI Research',
                location: 'Remote',
                size: '51-200',
                rating: 4.7,
                reviews: [
                  { student: 'Arjun Patel', role: 'Intern - Research', text: 'Worked on state-of-the-art models and published internal reports.' },
                ],
              },
              {
                id: 'c11',
                name: 'BuildRight',
                industry: 'Construction',
                location: 'Kolkata',
                size: '501-1000',
                rating: 3.7,
                reviews: [
                  { student: 'Sana Khan', role: 'Intern - Civil', text: 'Practical site visits and good exposure to real projects.' },
                ],
              },
              {
                id: 'c12',
                name: 'BlueOcean Media',
                industry: 'Media',
                location: 'Remote',
                size: '51-200',
                rating: 4.0,
                reviews: [
                  { student: 'Dev Malhotra', role: 'Intern - Content', text: 'Great editorial guidance and publication opportunities.' },
                ],
              },
            ] as any[]
          ).map((company) => (
            <Card key={company.id}>
              <CardHeader className="pb-3">
                <div className="h-14 w-14 rounded-md bg-primary/20 flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {company.industry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  {company.size} employees
                </div>

                {/* Rating and sample review */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{company.rating ?? "-"}/5</span>
                  </div>
                  <div className="text-xs text-muted-foreground">({company.reviews?.length ?? 0} reviews)</div>
                </div>

                {company.reviews && company.reviews.length > 0 && (
                  <div className="mb-3 rounded-md border p-3 bg-muted/10">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4" />
                      <div className="text-sm font-semibold">{company.reviews[0].student}</div>
                      <div className="text-xs text-muted-foreground">• {company.reviews[0].role}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{company.reviews[0].text}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1">View Openings</Button>
                  <Button variant="ghost" className="text-sm">View all reviews</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}