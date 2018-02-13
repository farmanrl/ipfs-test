const Resolver = require('ipld-resolver');
const BlockService = require('ipfs-block-service');
const Block = require('ipfs-block');
const multihashing = require('multihashing-async');
const IPFS = require('ipfs');
const IPFSRepo = require('ipfs-repo');  // storage repo
const CID = require('cids');

// const STRING = 'Hello World!';
const JSON_OBJECT = {
  name: 'Richard Farman',
  username: 'farmanrl',
  IPFS: true,
  object: {
    data: 'data'
  },
};

const getData = (cid, resolver) => {
  resolver.get(cid, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('GET Block');
    console.log(result.value.data.toString());
    // const data = Buffer.from(JSON.parse(result.value.data.toString()));
  });
};

const putData = (data, resolver) => {
  multihashing(data, 'sha2-256', (err, multihash) => {
    if (err) {
      throw err;
    }

    const cid = new CID(multihash);
    const block = new Block(data, cid);

    resolver.put(
      block, { cid }, (err, result) => {
        if (err) {
          throw err;
        }
        console.log('PUT Block');
        getData(result, resolver);
      });
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
  const data = Buffer.from(JSON.stringify(JSON_OBJECT));
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

const startNode = () => {
  const node = new IPFS();

  node.on('ready', () => {
    console.log('READY IPFSNode');
    getRepo();

    node.stop(() => {
      // node is now 'offline'
    });
  });
};

startNode();
