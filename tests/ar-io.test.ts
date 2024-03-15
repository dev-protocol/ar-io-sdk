import { ArIO } from '../src/common/ar-io.js';
import { RemoteContract } from '../src/common/contracts/remote-contract.js';
import { ARNS_DEVNET_REGISTRY_TX } from '../src/constants.js';
import { ArIOState } from '../src/contract-state.js';
import { SmartWeaveSortKey } from '../src/utils/smartweave.js';

const gatewayAddress = '1H7WZIWhzwTH9FIcnuMqYkTsoyv1OTfGa_amvuYwrgo';
const domain = 'ar-io';
const evaluateToBlockHeight = 1377100;
const evaluateToSortKey = new SmartWeaveSortKey(
  '000001376946,0000000000000,18d52956c8e13ae1f557b4e67f6f298b8ffd2a5cd96e42ec24ca649b7401510f',
);
describe('ArIO Client', () => {
  const arIO = new ArIO({
    contract: new RemoteContract<ArIOState>({
      url: process.env.REMOTE_CACHE_URL || 'http://localhost:3000',
      contractTxId: ARNS_DEVNET_REGISTRY_TX,
    }),
  });
  it('should create a custom ArIO client', () => {
    expect(arIO).toBeInstanceOf(ArIO);
  });

  it('should should return undefined for non existent gateway', async () => {
    const nonExistent = await arIO.getGateway({
      address: 'some-address',
    });
    expect(nonExistent).toEqual(undefined);
  });

  it('should return gateways at a given block height', async () => {
    const gateway = await arIO.getGateway({
      address: gatewayAddress,
      evaluationOptions: { evalTo: { blockHeight: evaluateToBlockHeight } },
    });
    expect(gateway).toBeDefined();
  });

  it('should return gateways at a given sort key', async () => {
    const gateway = await arIO.getGateway({
      address: gatewayAddress,
      evaluationOptions: { evalTo: { sortKey: evaluateToSortKey.toString() } },
    });
    expect(gateway).toBeDefined();
  });

  it('should return gateways at a given block height', async () => {
    const gateways = await arIO.getGateways({
      evaluationOptions: { evalTo: { blockHeight: evaluateToBlockHeight } },
    });
    expect(gateways[gatewayAddress]).toBeDefined();
  });

  it('should return gateways at a given sort key', async () => {
    const gateways = await arIO.getGateways({
      evaluationOptions: { evalTo: { sortKey: evaluateToSortKey.toString() } },
    });
    expect(gateways[gatewayAddress]).toBeDefined();
  });

  it('should return the record for an existing domain', async () => {
    const record = await arIO.getArNSRecord({ domain });
    expect(record).toBeDefined();
  });

  it('should throw return undefined for a non existent record', async () => {
    const nonExistent = await arIO.getArNSRecord({
      domain: 'some-domain',
    });
    expect(nonExistent).toEqual(undefined);
  });

  it('should fetch all records', async () => {
    const records = await arIO.getArNSRecords();
    expect(records).toBeDefined();
  });

  it('should return record at a given block height', async () => {
    const currentRecord = await arIO.getArNSRecord({
      domain,
      evaluationOptions: {
        evalTo: { blockHeight: evaluateToBlockHeight + 1 },
      },
    });
    expect(currentRecord).toBeDefined();
  });

  it('should return record at a given sort key', async () => {
    const record = await arIO.getArNSRecord({
      domain,
      evaluationOptions: {
        evalTo: { sortKey: evaluateToSortKey.toString() },
      },
    });
    expect(record).toBeDefined();
  });

  it('should return records at a given block height', async () => {
    const records = await arIO.getArNSRecords({
      evaluationOptions: {
        evalTo: { blockHeight: evaluateToBlockHeight },
      },
    });
    expect(records[domain]).toBeDefined();
  });

  it('should return records at a given sort key', async () => {
    const records = await arIO.getArNSRecords({
      evaluationOptions: {
        evalTo: { sortKey: evaluateToSortKey.toString() },
      },
    });
    expect(records[domain]).toBeDefined();
  });

  it('should return the current epoch information', async () => {
    const epoch = await arIO.getCurrentEpoch();
    expect(epoch).toBeDefined();
    expect(epoch.epochStartHeight).toBeDefined();
    expect(epoch.epochBlockLength).toBeDefined();
    expect(epoch.epochDistributionHeight).toBeDefined();
    expect(epoch.epochEndHeight).toBeDefined();
    expect(epoch.epochPeriod).toBeDefined();
    expect(epoch.epochZeroStartHeight).toBeDefined();
  });

  it('should return the current epoch information when evaluated at a given block height', async () => {
    const epoch = await arIO.getCurrentEpoch({
      evaluationOptions: { evalTo: { blockHeight: evaluateToBlockHeight } },
    });
    expect(epoch).toBeDefined();
    expect(epoch.epochStartHeight).toBeDefined();
    expect(epoch.epochBlockLength).toBeDefined();
    expect(epoch.epochDistributionHeight).toBeDefined();
    expect(epoch.epochEndHeight).toBeDefined();
    expect(epoch.epochPeriod).toBeDefined();
    expect(epoch.epochZeroStartHeight).toBeDefined();
  });

  it('should return the epoch information at a given block height', async () => {
    const epoch = await arIO.getEpoch({
      blockHeight: evaluateToBlockHeight,
    });
    expect(epoch).toBeDefined();
    expect(epoch.epochStartHeight).toBeDefined();
    expect(epoch.epochBlockLength).toBeDefined();
    expect(epoch.epochDistributionHeight).toBeDefined();
    expect(epoch.epochEndHeight).toBeDefined();
    expect(epoch.epochPeriod).toBeDefined();
    expect(epoch.epochZeroStartHeight).toBeDefined();
  });

  it('should return the prescribed observers for the current epoch', async () => {
    const observers = await arIO.getPrescribedObservers();
    expect(observers).toBeDefined();
    for (const observer of observers) {
      expect(observer.gatewayAddress).toBeDefined();
      expect(observer.observerAddress).toBeDefined();
      expect(observer.stake).toBeDefined();
      expect(observer.start).toBeDefined();
      expect(observer.stakeWeight).toBeDefined();
      expect(observer.tenureWeight).toBeDefined();
      expect(observer.gatewayRewardRatioWeight).toBeDefined();
      expect(observer.observerRewardRatioWeight).toBeDefined();
      expect(observer.compositeWeight).toBeDefined();
      expect(observer.normalizedCompositeWeight).toBeDefined();
    }
  });

  it.each([
    [{ sortKey: evaluateToSortKey.toString() }],
    [{ blockHeight: evaluateToBlockHeight }],
  ])(
    `should return the prescribed observers for provided evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const observers = await arIO.getPrescribedObservers({
        evaluationOptions: { evalTo },
      });
      expect(observers).toBeDefined();
      for (const observer of observers) {
        expect(observer.gatewayAddress).toBeDefined();
        expect(observer.observerAddress).toBeDefined();
        expect(observer.stake).toBeDefined();
        expect(observer.start).toBeDefined();
        expect(observer.stakeWeight).toBeDefined();
        expect(observer.tenureWeight).toBeDefined();
        expect(observer.gatewayRewardRatioWeight).toBeDefined();
        expect(observer.observerRewardRatioWeight).toBeDefined();
        expect(observer.compositeWeight).toBeDefined();
        expect(observer.normalizedCompositeWeight).toBeDefined();
      }
    },
  );

  it('should return observation information', async () => {
    const observations = await arIO.getObservations();
    const observation = await arIO.getObservations({
      epochStartHeight: parseInt(Object.keys(observations)[0]),
    });
    expect(observations).toBeDefined();
    expect(observation).toBeDefined();
  });

  it('should get the observation information at a given block height', async () => {
    const observations = await arIO.getObservations({
      evaluationOptions: { evalTo: { blockHeight: evaluateToBlockHeight } },
    });
    expect(observations).toBeDefined();
  });

  it('should return observations at a sortkey', async () => {
    const observations = await arIO.getObservations({
      evaluationOptions: { evalTo: { sortKey: evaluateToSortKey.toString() } },
    });
    expect(observations).toBeDefined();
  });

  it('should return distributions', async () => {
    const distributions = await arIO.getDistributions();
    expect(distributions).toBeDefined();
  });

  it('should return distributions at a blockheight', async () => {
    const distributions = await arIO.getDistributions({
      evaluationOptions: { evalTo: { blockHeight: evaluateToBlockHeight } },
    });
    expect(distributions).toBeDefined();
  });
  it('should return distributions at a sortkey', async () => {
    const distributions = await arIO.getDistributions({
      evaluationOptions: { evalTo: { sortKey: evaluateToSortKey.toString() } },
    });
    expect(distributions).toBeDefined();
  });

  it.each([
    [{ sortKey: evaluateToSortKey.toString() }],
    [{ blockHeight: evaluateToBlockHeight }],
  ])(
    `should return auction for provided evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const auction = await arIO.getAuction({
        domain: 'ardrive',
        evaluationOptions: { evalTo },
      });
      expect(auction).toBeDefined();
    },
  );

  it.each([
    [{ sortKey: evaluateToSortKey.toString() }],
    [{ blockHeight: evaluateToBlockHeight }],
  ])(
    `should return auction for provided evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const auctions = await arIO.getAuctions({
        evaluationOptions: { evalTo },
      });
      expect(auctions).toBeDefined();
    },
  );
});
