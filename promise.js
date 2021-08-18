const statuses = {
  pending: 'PENDING',
  fulfilled: 'FULFILED',
  rejected: 'REJECTED'
};

class MyPromise {
  thenFn = () => {};
  catchFn = () => {};

  constructor(fn) {
    this.status = statuses.pending;
    return fn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(data) {
    if (this.status == statuses.pending) {
      this.status = statuses.fulfilled;

      setTimeout(() => {
        try {
          return this.thenFn(data);
        } catch (error) {
          this.status = statuses.rejected;
          this.catchFn(error);
        }
      }, 0);
    }
  }

  reject(error) {
    if (this.status == statuses.pending) {
      this.status = statuses.rejected;

      setTimeout(() => {
        return this.catchFn(error);
      }, 0);
    }
  }

  then(onResolved, onRejected) {
    if (onResolved) {
      this.thenFn = onResolved;
    }

    if (onRejected) {
      this.catchFn = onRejected;
    }

    return this;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

const promiseTimeout = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Time is over');
    reject(new Error('Error'));
  }, 1000);
});

promiseTimeout
  .then(data => {
    console.log(data);
    throw new Error('Error!');
  })
  .catch(error => console.log(error.message ? error.message : error));
