import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Internship } from '@/dbConnection/Schema/internship';
import { Application } from '@/dbConnection/Schema/application';
import { User } from '@/dbConnection/Schema/user';

export async function GET() {
    try {
        await connectDb();

        // Total counts
        const totalInternships = await Internship.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalUsers = await User.countDocuments();

        // Active users in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Unique applicants (distinct applicant ids)
        const uniqueApplicantsAgg = await Application.aggregate([
            { $group: { _id: '$applicant' } },
            { $count: 'uniqueApplicants' },
        ]);
        const uniqueApplicants = uniqueApplicantsAgg?.[0]?.uniqueApplicants ?? 0;

        // Pending applications
        const pendingApplications = await Application.countDocuments({ status: 'pending' });

        const payload = {
            totalInternships,
            totalApplications,
            totalUsers,
            activeUsers,
            uniqueApplicants,
            pendingApplications,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: payload });
    } catch (err) {
        console.error('stats error', err);
        return NextResponse.json({ success: false, error: 'Failed to compute stats' }, { status: 500 });
    }
}
