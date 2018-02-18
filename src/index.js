const Resolver = require('ipld-resolver');
const BlockService = require('ipfs-block-service');
const IPFSRepo = require('ipfs-repo'); // storage repo

// const STRING = 'Hello World!';
const farmanrl = {
  name: 'Richard Farman',
  username: 'farmanrl',
  age: 23,
};

const getData = (cid, resolver) =>
  new Promise((resolve, reject) => {
    resolver.get(cid, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

const putData = (data, resolver) =>
  new Promise((resolve, reject) => {
    resolver.put(
      data, { format: 'dag-cbor', hashAlg: 'sha2-256' },
      (err, cid) => {
        if (err) {
          reject(err);
        }
        resolve(cid);
      });
  });

const getResolver = (repo) => {
  const blockService = new BlockService(repo);
  const resolver = new Resolver(blockService);
  return resolver;
};

const testResolver = (resolver) => {
  const data = farmanrl;
  putData(data, resolver).then((cid) => {
    console.log(cid);
    getData(cid, resolver).then((result) => {
      console.log(result.value);
    });
  });
};

const openRepo = (repo) =>
  new Promise((resolve, reject) => {
    repo.open((err) => {
      if (err) {
        reject(err);
      }
      resolve(repo);
    });
  });

const initRepo = (repo) =>
  new Promise((resolve, reject) => {
    repo.init({ cool: 'config' }, (err) => {
      if (err) {
        reject(err);
      }
      resolve(repo);
    });
  });

const getRepo = () =>
  new Promise((resolve, reject) => {
    const repo = new IPFSRepo('repo');
    repo.exists((err, bool) => {
      if (bool) {
        openRepo(repo).then((repo) => {
          resolve(repo);
        });
      } else {
        initRepo(repo).then((repo) => {
          openRepo(repo).then((repo) => {
            resolve(repo);
          });
        });
      }
    });
  });

const doFunc = () => {
  getRepo().then((repo) => {
    const resolver = getResolver(repo);
    testResolver(resolver);
  });
}

doFunc();
