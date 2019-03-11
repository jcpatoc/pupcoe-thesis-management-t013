const config = {
  development: {
    db: {
  database: 'dvfdfp4vj3j1i',
  user: 'jrhzycwpswvxsu',
  password: '6167b01eac3aa94488ee654110440224ab95d442a93db8fb7fe83a5d107dc93c',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
    },
    nodemailer: {
    }
  },
  production: {
    db: {
   database: 'dvfdfp4vj3j1i',
  user: 'jrhzycwpswvxsu',
  password: '6167b01eac3aa94488ee654110440224ab95d442a93db8fb7fe83a5d107dc93c',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;
