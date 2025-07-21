"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      className="group cursor-pointer"
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3 overflow-hidden">
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">
              {project.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {project.category}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-3 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech.slice(0, 2).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {project.url && (
                <Button size="sm" className="flex-1 text-xs">
                  <ExternalLink size={12} className="mr-1" />
                  Demo
                </Button>
              )}
              {project.github && (
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Github size={12} className="mr-1" />
                  Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}