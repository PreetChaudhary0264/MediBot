import { randomUUID } from "crypto";

/**
 * In-memory storage for reports and chat messages
 * Simulates a lightweight database using Maps
 */
class MemStorage {
  constructor() {
    this.reports = new Map();
    this.messages = new Map();
  }

  // --- Reports ---

  async createReport(data) {
    const id = randomUUID();
    const report = { ...data, id, uploadedAt: new Date() };
    this.reports.set(id, report);
    return report;
  }

  async getReport(id) {
    return this.reports.get(id);
  }

  async getAllReports() {
    return [...this.reports.values()].sort(
      (a, b) => b.uploadedAt - a.uploadedAt
    );
  }

  async updateReport(id, updates) {
    const report = this.reports.get(id);
    if (!report) return;
    Object.assign(report, updates);
    this.reports.set(id, report);
  }

  async setReportError(id, error) {
    await this.updateReport(id, { analysisError: error });
  }

  async updateReportExplanation(id, explanation) {
    await this.updateReport(id, { explanation, analysisError: null });
  }

  // --- Messages ---

  async createMessage(data) {
    const id = randomUUID();
    const message = { ...data, id, createdAt: new Date() };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByReportId(reportId) {
    return [...this.messages.values()]
      .filter((m) => m.reportId === reportId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }
}

export const storage = new MemStorage();
