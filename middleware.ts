import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/colleges',
    '/colleges/:path+',
    '/exams',
    '/scholarships',
    '/compare',
    '/dashboard',
    '/dashboard/:path+',
    '/admin',
    '/admin/:path+',
  ],
};
