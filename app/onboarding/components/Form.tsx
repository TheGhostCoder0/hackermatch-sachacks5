import React from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collections, auth, db } from "../../firebase/client";

interface InputFormData {
  name: string;
  major?: string;
  college?: string;
  skills?: string;
  hackathons: number;
  github: string;
  linkedin: string;
  devpost: string;
  email: string;
  currentHackathon: string;
}

const Form = () => {
  const [user, authLoading] = useAuthState(auth);

  const { register, handleSubmit } = useForm<InputFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: InputFormData) => {
    if (!user) return;
    await updateDoc(doc(db, Collections.users, user.uid), {
      email: data.email,
      linkedinUrl: data.linkedin,
      githubProfileUrl: data.github,
      devpostProfileUrl: data.devpost,
      major: data.major,
      college: data.college,
      currentHackathon: data.currentHackathon,
      skills: data.skills, 
      hackathons: data.hackathons,
    });
  };

  return (
    <div className="flex justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name *
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-700"
          >
            Major
          </label>
          <input
            {...register("major")}
            id="major"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Computer Science"
          />
        </div>

        <div>
          <label
            htmlFor="college"
            className="block text-sm font-medium text-gray-700"
          >
            College
          </label>
          <input
            {...register("college")}
            id="college"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="University of California, Davis"
          />
        </div>

        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            List of Skills *
          </label>
          <input
            {...register("skills")}
            id="skills"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="JavaScript, React, Next.js"
          />
        </div>

        <div>
          <label
            htmlFor="hackathons"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Hackathons Attended *
          </label>
          <input
            {...register("hackathons")}
            id="hackathons"
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="3"
          />
        </div>

        {/* Profile Links */}
        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-gray-700"
          >
            GitHub Profile
          </label>
          <input
            {...register("github")}
            id="github"
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn
          </label>
          <input
            {...register("linkedin")}
            id="linkedin"
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>

        <div>
          <label
            htmlFor="devpost"
            className="block text-sm font-medium text-gray-700"
          >
            Devpost Link
          </label>
          <input
            {...register("devpost")}
            id="devpost"
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="https://devpost.com/yourusername"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="yourname@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="currentHackathon"
            className="block text-sm font-medium text-gray-700"
          >
            Current Hackathon Looking For Team
          </label>
          <input
            {...register("currentHackathon")}
            id="currentHackathon"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="SacHacks"
          />
        </div>

        <div className="pt-5">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
