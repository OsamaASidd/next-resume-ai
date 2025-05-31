'use client';
import React from 'react';
import 'animate.css';
// import { auth } from '@clerk/nextjs/server';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

const LandingPage: React.FC = () => {
  //   const { userId } = await auth();
  const { userId } = useAuth();
  const router = useRouter();
  const handleTryClick = () => {
    console.log('TRY RESUME ');
    // return redirect('/sign-in');
  };
  return (
    <div className='min-h-screen font-sans'>
      <div className='mx-auto grid max-w-7xl gap-10 p-8 md:grid-cols-2'>
        {/* Left Side */}
        <div className='flex flex-col justify-center'>
          <div className='animate__animated animate__fadeInUp'>
            <h1 className='text-5xl font-bold leading-tight text-blue-600'>
              Design
            </h1>
            <span className='text-5xl font-bold leading-tight'>
              resumes that win.
            </span>
          </div>
          <div className='animate__animated animate__fadeIn'>
            <p className='mt-6 text-lg'>
              The template includes carefully structured sections for personal
              information, summary or objective, work experience, education,
              skills, projects, certifications, and more. You can easily
              customize these sections to fit your unique background.
            </p>
            <div className='flex space-x-3'>
              <button
                onClick={handleTryClick}
                className='mt-8 w-fit rounded-lg bg-blue-700 px-6 py-3 text-lg text-white hover:bg-blue-800'
              >
                Try Resume.AI for Free
              </button>
              <button
                onClick={() => router.push('/sign-in')}
                className='mt-8 w-fit rounded-lg border border-blue-700 px-6 py-3 text-lg text-blue-600 transition hover:bg-blue-600 hover:text-white'
              >
                <div>Sign In</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='animate__animated animate__delay-1s animate__fadeInRight space-y-6'>
          {/* Profile Card */}
          <div className='rounded-lg border p-6 shadow-sm'>
            <div className='flex items-start gap-7'>
              <img
                src='https://global.discourse-cdn.com/monzo/original/3X/3/a/3aae66f7a0128dc50c915d2687d1abad85de36f3.jpeg'
                alt='Avatar'
                className='h-12 w-12 rounded-full'
              />
              <div>
                <h2 className='text-lg font-semibold'>Jane Doe</h2>
                <p className='text-sm'>Frontend Developer</p>
                <h3 className='mt-2 font-semibold'>Bio</h3>
                <p className='text-sm'>
                  I’m A Frontend Developer With 3years Experience In ReactJs And
                  VueJs
                </p>
              </div>
            </div>
          </div>

          {/* Work History */}
          <div className='rounded-lg border p-6 shadow-sm'>
            <h3 className='mb-2 text-lg font-semibold'>Work History</h3>
            <p className='font-medium'>Cloud Engineer | Yep!, USA</p>
            <p className='mb-2 text-sm'>March 2022 – Present</p>
            <div className='space-y-3 text-sm'>
              <p>I Am Christian Chiemela</p>
              <p>
                A Cloud Engineer, A Nigerian With The Passion For Creating
                Stunning And User-Friendly Websites And Applications. With
                3years Plus Experience In The Industry, I Have Honed Skills In
                HTML, CSS, Javascript, As Well As Modern Frontend Frameworks
                Such As ReactJs And VueJs.
              </p>
              <p>
                I Began My Career At Esoft Response A United Kingdom Base
                Company Where I Quickly Develop The Interest In Frontend
                Development. Years Later I Moved To YEP! A United States Of
                America Base Company Where I Am Responsible For The Development
                And Maintenance Of Several High-Traffic Websites.
              </p>
              <p>
                I Have The Ability Of Turning Complex Design Concepts Into
                Highly Optimized And Accessible User Interfaces, Which Are Up To
                Date With The Latest Trends And Technologies In The Industry. I
                Am Always Looking For Ways To Improve The User Experience And
                Performance Of My Projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
