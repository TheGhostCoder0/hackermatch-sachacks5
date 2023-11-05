import React from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
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
  location: string;
}

const Form = () => {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

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
    router.push("/home");
  };

  return (
    <div className="flex justify-center">
      <div
        className="rounded border border-gray-200 shadow-lg px-10 py-8"
        style={{
          backgroundColor: "black",
          borderColor: "white",
          maxWidth: "800px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-hacker-green"
            >
              Name *
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="John Smith"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-match-pink"
            >
              Email *
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="yourname@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="currentHackathon"
              className="block text-sm font-medium text-hacker-green"
            >
              Current Hackathon *
            </label>
            <input
              {...register("currentHackathon")}
              id="currentHackathon"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="SacHacks"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-match-pink"
            >
              Location *
            </label>
            <input
              {...register("location")}
              id="location"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="Sacramento"
            />
          </div>
          <div>
            <label
              htmlFor="college"
              className="block text-sm font-medium text-hacker-green"
            >
              College *
            </label>
            <input
              {...register("college")}
              id="college"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="University of California, Davis"
            />
          </div>
          <div>
            <label
              htmlFor="major"
              className="block text-sm font-medium text-match-pink"
            >
              Major *
            </label>
            <input
              {...register("major")}
              id="major"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-hacker-green"
            >
              List of Skills *
            </label>
            <input
              {...register("skills")}
              id="skills"
              type="text"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="JavaScript, React, Next.js"
            />
          </div>
          <div>
            <label
              htmlFor="hackathons"
              className="block text-sm font-medium text-match-pink"
            >
              Number of Hackathons Attended *
            </label>
            <input
              {...register("hackathons")}
              id="hackathons"
              type="number"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="3"
            />
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-hacker-green"
            >
              LinkedIn
            </label>
            <input
              {...register("linkedin")}
              id="linkedin"
              type="url"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-match-pink"
            >
              GitHub Profile *
            </label>
            <input
              {...register("github")}
              id="github"
              type="url"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label
              htmlFor="devpost"
              className="block text-sm font-medium text-hacker-green"
            >
              Devpost Link *
            </label>
            <input
              {...register("devpost")}
              id="devpost"
              type="url"
              className="mt-1 w-[30vw] rounded-md shadow-sm"
              style={{
                backgroundColor: "white",
                color: "black",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              placeholder="https://devpost.com/yourusername"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-[30vw] justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-hacker-green hover:bg-match-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hacker-green"
            >
              Find my hacker_match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
