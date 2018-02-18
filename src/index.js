const Resolver = require('ipld-resolver');
const BlockService = require('ipfs-block-service');
const IPFSRepo = require('ipfs-repo'); // storage repo

// const STRING = 'Hello World!';
const JSON_OBJECT = {
  name: 'Richard Farman',
  username: 'farmanrl',
  age: 31,
};

const getData = (cid, resolver) => {
  resolver.get(cid, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('GET Block');
    console.log(result.value);
    // const data = Buffer.from(JSON.parse(result.value.data.toString()));
  });
};

const putData = (data, resolver) => {
  resolver.put(data, {
    format: 'dag-cbor', hashAlg: 'sha2-256',
  }, (err, cid) => {
    if (err) {
      throw err;
    }
    console.log('PUT Block');
    getData(cid, resolver);
  });
};

const getResolver = (repo) => {
  const blockService = new BlockService(repo);
  const resolver = new Resolver(blockService);
  return resolver;
};

const testRepo = (repo) => {
  const resolver = getResolver(repo);
  // const data = Buffer.from(STRING);
  const data = JSON_OBJECT;
  putData(data, resolver);
};

const openRepo = (repo) => {
  repo.open((err) => {
    if (err) {
      throw err;
    }
    console.log('OPEN IPFSRepo');
    testRepo(repo);
  });
};

const initRepo = (repo) => {
  repo.init({ cool: 'config' }, (err) => {
    if (err) {
      throw err;
    }
    console.log('INIT IPFSRepo');
    openRepo(repo);
  });
};

const getRepo = () => {
  const repo = new IPFSRepo('repo');
  repo.exists((err, bool) => {
    if (bool) {
      openRepo(repo);
    } else {
      initRepo(repo);
    }
  });
};

getRepo();
