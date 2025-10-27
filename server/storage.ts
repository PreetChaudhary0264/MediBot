import { type Report, type InsertReport, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  updateReportExplanation(id: string, explanation: string): Promise<void>;
  setReportError(id: string, error: string): Promise<void>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByReportId(reportId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private reports: Map<string, Report>;
  private messages: Map<string, Message>;

  constructor() {
    this.reports = new Map();
    this.messages = new Map();
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      uploadedAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async updateReportExplanation(id: string, explanation: string): Promise<void> {
    const report = this.reports.get(id);
    if (report) {
      report.explanation = explanation;
      report.analysisError = null;
      this.reports.set(id, report);
    }
  }

  async setReportError(id: string, error: string): Promise<void> {
    const report = this.reports.get(id);
    if (report) {
      report.analysisError = error;
      this.reports.set(id, report);
    }
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByReportId(reportId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.reportId === reportId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
