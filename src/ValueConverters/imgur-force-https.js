import moment from 'moment';

export class ImgurForceHttpsValueConverter {
  toView(value) {
    return value.replace('http:', 'https:');
  }
}
