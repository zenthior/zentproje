"use client";

import { motion } from "framer-motion";
import { Code, Palette, Zap, Award, Users, Clock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

const skills = [
  { name: "React & Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX Design", level: 80 },
  { name: "Database Design", level: 85 },
  { name: "DevOps", level: 75 }
];

const experiences = [
  {
    title: "Senior Full Stack Developer",
    company: "ZentProje",
    period: "2020 - Günümüz",
    description: "Modern web uygulamaları geliştirme ve proje yönetimi"
  },
  {
    title: "Frontend Developer",
    company: "Tech Company",
    period: "2018 - 2020",
    description: "React ve Vue.js ile kullanıcı arayüzü geliştirme"
  },
  {
    title: "Web Developer",
    company: "Digital Agency",
    period: "2016 - 2018",
    description: "Kurumsal web siteleri ve e-ticaret platformları"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hakkımda
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Tutkulu bir web geliştirici olarak modern teknolojilerle projeler üretiyorum
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Merhaba! Ben ZentProje
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              <p>
                5+ yıllık deneyimim ile modern web teknolojilerini kullanarak 
                kullanıcı dostu ve performanslı web uygulamaları geliştiriyorum.
              </p>
              <p>
                React, Next.js, TypeScript ve Node.js gibi teknolojilerde uzmanlaşmış 
                durumda olup, her projede en iyi kullanıcı deneyimini sunmaya odaklanıyorum.
              </p>
              <p>
                Müşteri memnuniyeti ve kaliteli kod yazımı benim için en önemli önceliklerdir. 
                Her projede modern tasarım prensiplerini ve en iyi uygulamaları takip ederim.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <Award className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">50+</div>
              <div className="text-slate-600 dark:text-slate-300">Tamamlanan Proje</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">30+</div>
              <div className="text-slate-600 dark:text-slate-300">Mutlu Müşteri</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">5+</div>
              <div className="text-slate-600 dark:text-slate-300">Yıl Deneyim</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <Code className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-300">Destek</div>
            </div>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Yeteneklerim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                  <span className="text-blue-600 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    className="bg-blue-600 h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Deneyimim
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {exp.period}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </section>
    </div>
  );
}