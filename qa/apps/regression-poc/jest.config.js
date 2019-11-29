module.exports = {
  name: 'regression-poc',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/regression-poc',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
