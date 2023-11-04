import Image from "next/image";

export default function userProfile() {
  return (
    <>
      <Image
        src="https://example.com/hero.jpg"
        alt="Landscape picture"
        width={800}
        height={500}
      />

      <h3 className="text-3xl font-bold dark:text-white">John Smith</h3>

      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Skills:
      </h2>
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        <li>React</li>
        <li>Next.js</li>
        <li>Tailwind CSS</li>
      </ul>

      <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        <div className="flex flex-col pb-3">
          <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            Email address
          </dt>
          <dd className="text-lg font-semibold">yourname@example.com</dd>
        </div>
        <div className="flex flex-col py-3">
          <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            LinkedIn
          </dt>
          <dd className="text-lg font-semibold">
            https://www.linkedin.com/in/example/
          </dd>
        </div>
        <div className="flex flex-col pt-3">
          <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
            GitHub
          </dt>
          <dd className="text-lg font-semibold">https://github.com/example</dd>
        </div>
      </dl>
    </>
  );
}
