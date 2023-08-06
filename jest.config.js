
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [`node_modules/(?!(react-bootstrap-tagsinput))`]
  //디폴트 값이 node_modules 이하 값은 transfile하지 말고 무시해라인데, tag-input이라는 라이브러리를 설치했기 때문에 이부분은 트랜스폼이 필요함.
  //이에 ignore 하는 부분에서 tag-input을 제외해달라는 정규표현식.
};

module.exports= config;