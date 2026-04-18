import {IconButton} from '../../components/mui-wrappers';
import {IconChevronRight} from '@tabler/icons-react';
import {useTranslation} from 'next-i18next';

interface Props {
  onClick: () => void;
  tabIndex?: number;
  disabled?: boolean;
}

const AssignButton = (props: Props) => {
  const {onClick, tabIndex} = props;
  const {t} = useTranslation();

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} onClick={onClick} tabIndex={tabIndex}>
      <IconButton disabled={props.disabled} style={{ padding: 0 }}>
        {t('passenger.actions.place')}
        <IconChevronRight size={16} />
      </IconButton>
    </div>
  );
};

export default AssignButton;
