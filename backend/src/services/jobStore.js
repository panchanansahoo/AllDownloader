const { randomUUID } = require("crypto");

const jobs = new Map();

function createJob(payload) {
  const id = randomUUID();
  const job = {
    id,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  jobs.set(id, job);
  return job;
}

function getJob(id) {
  return jobs.get(id) || null;
}

module.exports = {
  createJob,
  getJob,
};

