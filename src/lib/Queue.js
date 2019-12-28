import Bull from 'bull';

import redisConfig from '../config/redis';

import RegistrationMail from '../app/jobs/RegistrationMail';
import RegistrationUpdateMail from '../app/jobs/RegistrationUpdateMail';
import RegistrationCancelMail from '../app/jobs/RegistrationCancelMail';
import HelpOrderAnswerMail from '../app/jobs/HelpOrderAnswerMail';
import ForgotPasswordMail from '../app/jobs/ForgotPasswordMail';
import StudentAccessTokenMail from '../app/jobs/StudentAccessTokenMail';

const jobs = [
  RegistrationMail,
  RegistrationUpdateMail,
  RegistrationCancelMail,
  HelpOrderAnswerMail,
  ForgotPasswordMail,
  StudentAccessTokenMail,
];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bull: new Bull(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bull.add(job);
  }

  processQueue() {
    jobs.forEach(job => {
      const { bull, handle } = this.queues[job.key];

      bull.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
