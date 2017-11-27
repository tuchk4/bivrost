# File upload

Use [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to
upload files.

```js
import bivrostApi from 'bivrost/http/api';
import DataSource from 'bivrost/data/source';
import fetchAdapter from 'bivrost-fetch-adapter';

const api = bivrostApi({
  host: 'localhost:3001',
  adapter: fetchAdapter(),
});

class ImagesDataSource extends DataSource {
  static api = {
    save: api('POST /images', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }),
  };

  saveImage(images) {
    return this.invoke('save', images);
  }
}

const formData = new FormData();
formData.append('image', imageUploadInput.files[0]);

const imagesDataSource = new ImagesDataSource();
imagesDataSource.saveImage(formData).then(response => {
  console.log('images are saved');
});
```
