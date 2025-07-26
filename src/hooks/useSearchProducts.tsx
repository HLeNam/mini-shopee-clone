import { z } from 'zod';
import { useForm } from 'react-hook-form';
// import { isEmpty, omit, omitBy } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSearchParams, useNavigate } from 'react-router-dom';

import PATH from '~/constants/path';
import useQueryConfig from '~/hooks/useQueryConfig';
import { mergeUrlPaths } from '~/utils/utils';

const OMIT_SEARCH_QUERY = ['order', 'sort_by'];

const searchSchema = z.object({
  search: z.string()
});

type SearchFormData = z.infer<typeof searchSchema>;

const useSearchProducts = () => {
  const queryConfig = useQueryConfig();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: ''
    }
  });

  const onSubmitSearch = handleSubmit((data) => {
    // console.log('>>> header log::: ', data);

    let config = {
      ...queryConfig,
      name: data.search
    };

    if (queryConfig.order) {
      config = omit(config, OMIT_SEARCH_QUERY) as typeof config;
    }

    navigate({
      pathname: mergeUrlPaths(PATH.home),
      search: createSearchParams(omitBy(config, isEmpty)).toString()
    });
  });

  return {
    onSubmitSearch,
    register
  };
};

export default useSearchProducts;
