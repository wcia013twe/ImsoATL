import { content } from '@/lib/content';

export default function IntroductionSection() {
  return (
    <section className="w-full bg-surface py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {content.introduction.heading}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {content.introduction.body}
          </p>
        </div>
      </div>
    </section>
  );
}
