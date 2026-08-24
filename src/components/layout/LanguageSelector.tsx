import { Box, FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, type SupportedLanguage } from '@/i18n';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.split('-')[0] as SupportedLanguage ?? 'it';

  const changeLanguage = (event: SelectChangeEvent) => {
    void i18n.changeLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <FormControl size="small" variant="outlined" sx={{ minWidth: { xs: 74, sm: 116 } }}>
      <Select
        value={language}
        onChange={changeLanguage}
        aria-label={t('language.label')}
        IconComponent={LanguageRoundedIcon}
        sx={{
          height: 36,
          fontSize: '.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          '& .MuiSelect-select': { py: .75, pl: 1.25, pr: '31px !important' },
          '& .MuiSvgIcon-root': { right: 5, color: 'text.secondary', fontSize: 19 },
        }}
      >
        {supportedLanguages.map((code) => (
          <MenuItem key={code} value={code}>
            <span aria-hidden>{code.toUpperCase()}</span>
            <Box component="span" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>{t(`language.${code}`)}</Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
