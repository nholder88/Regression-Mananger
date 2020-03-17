module.exports = {
  name: 'regression-poc',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/regression-poc',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
