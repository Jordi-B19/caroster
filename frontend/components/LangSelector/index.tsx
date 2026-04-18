import {Select} from '@mantine/core';
import {Enum_Event_Lang} from '../../generated/graphql';
import {langs, langLocales} from '../../locales/constants';

type Props = {
  value: Enum_Event_Lang;
  onChange: (lang: Enum_Event_Lang) => void;
};

const LangSelector = (props: Props) => {
  return (
    <Select
      labelId="lang-selector"
      id="lang-selector"
      value={props.value}
      onChange={(value) => props.onChange(value as Enum_Event_Lang)}
      data={langs
        .filter((lang) => !!langLocales[lang])
        .map((lang) => ({
          value: lang,
          label: langLocales[lang],
        }))}
    />
  );
};

export default LangSelector;
