import ApiService from 'services/ApiService';
import t from 'store/types';

export const submitOptions = ({ form }) => {
  return (dispatch) => {
    return ApiService.post('settings', form).then((response) => {
      dispatch({
        type: t.SETTING_SET,
        options: form.options,
      });
      return response;
    });
  };
};

export const FetchOptions = ({ form }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get('settings')
        .then((response) => {
          dispatch({
            type: t.SETTING_SET,
            options: response.data.settings,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
