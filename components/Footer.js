import React from 'react';
import { InfoCircle } from '@styled-icons/boxicons-regular/InfoCircle';
import { Github } from '@styled-icons/fa-brands/Github';
import { Slack } from '@styled-icons/fa-brands/Slack';
import { Twitter } from '@styled-icons/fa-brands/Twitter';
import { Blog } from '@styled-icons/icomoon/Blog';
import { Mail } from '@styled-icons/octicons/Mail';
import { truncate } from 'lodash';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import languages from '../lib/constants/locales';
import useLoggedInUser from '../lib/hooks/useLoggedInUser';

import TranslateIcon from './icons/TranslateIcon';
import Container from './Container';
import { Box, Flex } from './Grid';
import Image from './Image';
import Link from './Link';
import ListItem from './ListItem';
import StyledLink from './StyledLink';
import StyledSelect from './StyledSelect';
import StyledTooltip from './StyledTooltip';
import { P, Span } from './Text';

const SocialLink = styled.a`
  align-items: center;
  border: 1px solid #dcdee0;
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
  color: #76777a;
  opacity: 1;

  &:hover,
  &:focus {
    opacity: 0.8;
  }
`;

const MenuLink = styled(StyledLink)`
  color: #4e5052;
  display: block;
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  letter-spacing: -0.1px;
  margin: 0;
  padding: 0;
`;

const FlexList = styled.ul([], ...Box.componentStyle.rules, ...Flex.componentStyle.rules);

const messages = defineMessages({
  platform: {
    id: 'platform',
    defaultMessage: 'Platform',
  },
  'platform.explainerVideo': {
    id: 'platform.explainerVideo',
    defaultMessage: 'Explainer video',
  },
  'platform.howItWorks': {
    id: 'platform.howItWorks',
    defaultMessage: 'How it works',
  },
  'platform.useCases': {
    id: 'platform.useCases',
    defaultMessage: 'Use cases',
  },
  'platform.signup': {
    id: 'platform.signup',
    defaultMessage: 'Sign up',
  },
  'platform.login': {
    id: 'platform.login',
    defaultMessage: 'Log in',
  },
  join: {
    id: 'join',
    defaultMessage: 'Join',
  },
  'join.createACollective': {
    id: 'home.create',
    defaultMessage: 'Create a Collective',
  },
  'join.aboutFiscalHosting': {
    id: 'join.aboutFiscalHosting',
    defaultMessage: 'About Fiscal Hosting',
  },
  'join.discover': {
    id: 'menu.discover',
    defaultMessage: 'Discover',
  },
  'join.findAFiscalHost': {
    id: 'join.findAFiscalHost',
    defaultMessage: 'Find a Fiscal Host',
  },
  'join.becomeASponsor': {
    id: 'join.becomeASponsor',
    defaultMessage: 'Become a sponsor',
  },
  'join.becomeAHost': {
    id: 'join.becomeAHost',
    defaultMessage: 'Become a Host',
  },
  community: {
    id: 'community',
    defaultMessage: 'Community',
  },
  'community.openSource': {
    id: 'community.openSource',
    defaultMessage: 'Open Source',
  },
  'community.docsAndHelp': {
    id: 'menu.docs',
    defaultMessage: 'Docs & Help',
  },
  'community.support': {
    id: 'community.support',
    defaultMessage: 'Support',
  },
  company: {
    id: 'company',
    defaultMessage: 'Company',
  },
  'company.about': {
    id: 'collective.about.title',
    defaultMessage: 'About',
  },
  'company.blog': {
    id: 'company.blog',
    defaultMessage: 'Blog',
  },
  'company.hiring': {
    id: 'company.hiring',
    defaultMessage: 'Hiring',
  },
  'company.e2c': {
    id: 'e2c.title',
    defaultMessage: 'Exit to Community #E2C',
  },
  'company.termsOfService': {
    id: 'company.termsOfService',
    defaultMessage: 'Terms of service',
  },
  'company.privacyPolicy': {
    id: 'company.privacyPolicy',
    defaultMessage: 'Privacy Policy',
  },
  'company.securityPolicy': {
    id: 'company.securityPolicy',
    defaultMessage: 'Security Policy',
  },
});

const navigation = {
  platform: {
    explainerVideo: 'https://www.youtube.com/watch?v=IBU5fSILAe8',
    howItWorks: '/how-it-works',
    useCases: 'https://blog.opencollective.com/tag/case-studies/',
    signup: '/create-account',
    login: '/signin',
  },
  join: {
    createACollective: '/create',
    aboutFiscalHosting: '/fiscal-hosting',
    discover: '/search',
    findAFiscalHost: '/search?isHost=true',
    becomeASponsor: '/become-a-sponsor',
    becomeAHost: '/become-a-host',
  },
  community: {
    openSource: 'https://github.com/opencollective/opencollective/issues',
    Slack: 'https://slack.opencollective.com',
    docsAndHelp: '/help',
  },
  company: {
    about: 'https://docs.opencollective.com/help/about/introduction',
    blog: 'https://blog.opencollective.com/',
    hiring: '/hiring',
    e2c: '/e2c',
    termsOfService: '/tos',
    privacyPolicy: '/privacypolicy',
    securityPolicy: 'https://docs.opencollective.com/help/product/security',
  },
};

const switchLanguage = key => {
  document.cookie = `language=${key};path=/`;
  window.location.reload();
  window.scrollTo(0, 0);
};

const FooterContainer = styled.footer.attrs({
  id: 'footer',
})`
  display: flex;
  justify-content: center;
  background: white;
  border-top: 1px solid #e8e9eb;
  min-height: 7.5rem;
  width: 100%;
  padding: 1rem;
`;

const generateLanguageOptions = () => {
  return Object.keys(languages).map(key => {
    const language = languages[key];
    return {
      value: key,
      label: `${truncate(`${language.name} - ${language.nativeName}`, { length: 23 })} (${language.completion})`,
    };
  });
};

const Footer = () => {
  const intl = useIntl();
  const languageOptions = React.useMemo(generateLanguageOptions);
  const defaultLanguage = languageOptions.find(language => language.value === intl.locale);
  const { LoggedInUser } = useLoggedInUser();
  const formatLanguageOptionLabel = ({ value, label }, { context }) => (
    <Span fontSize="12px" fontWeight={context === 'menu' && value === intl.locale ? 'bold' : 'normal'}>
      {label}
    </Span>
  );

  return (
    <FooterContainer>
      <Container
        display="flex"
        flexDirection={['column', null, null, null, 'row']}
        justifyContent="space-between"
        alignItems={['center', null, null, null, 'flex-start']}
        width={[1, '650px', null, '671px', '1280px']}
      >
        <Flex
          justifyContent="space-between"
          alignItems={['center', 'flex-start']}
          mx={['auto', 3]}
          flexDirection={['column', 'row', null, null, 'column']}
          css="max-width: 1300px;"
          width={[1, null, null, null, '228px']}
        >
          <Container
            order={[null, null, null, null, '1']}
            display="flex"
            mt={3}
            width={[1, 1 / 3, null, null, 1]}
            alignItems={['center', 'flex-start']}
            flexDirection="column"
            maxWidth="300px"
          >
            <Flex my="12px">
              <Image
                src="/static/images/opencollectivelogo-footer-n.svg"
                alt="Open Collective logo"
                height={28}
                width={167}
              />
            </Flex>
            <P
              textAlign={['center', 'left']}
              color="black.800"
              fontSize="12px"
              lineHeight="18px"
              letterSpacing="-0.04px"
            >
              <FormattedMessage id="footer.OC.description" defaultMessage="Make your community sustainable." />
            </P>
          </Container>
          <Container
            order={[null, null, null, null, '3']}
            color="#6E747A"
            textAlign={'left'}
            mt={[4, null, null, null, 0]}
            display={[null, 'none', null, null, 'block']}
          >
            <P as="div" pb={2} pt={2}>
              <TranslateIcon />
              <Span
                mx={2}
                style={{ verticalAlign: 'middle' }}
                fontSize="10px"
                fontWeight="600"
                color="black.800"
                lineHeight="15px"
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
                <FormattedMessage id="footer.changeLanguage" defaultMessage="change language" />
              </Span>
              <StyledTooltip
                content={() => (
                  <FormattedMessage
                    id="Footer.Languages.JoinEffort"
                    defaultMessage="No technical skill is required to contribute to translations. You can join the effort on {crowdinLink} 🌐"
                    values={{
                      crowdinLink: (
                        <StyledLink href="https://crowdin.com/project/opencollective" openInNewTab>
                          Crowdin
                        </StyledLink>
                      ),
                    }}
                  />
                )}
              >
                <InfoCircle size={16} />
              </StyledTooltip>
            </P>
            <Container width="230px" my={2}>
              <StyledSelect
                inputId="language-options"
                options={languageOptions}
                onChange={({ value }) => switchLanguage(value)}
                defaultValue={defaultLanguage}
                borderRadius="10px"
                menuPlacement="auto"
                width={1}
                formatOptionLabel={formatLanguageOptionLabel}
              />
            </Container>
          </Container>
          <Container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={1}
            my={4}
            order={['2', '3', null, null, '2']}
            maxWidth="230px"
            flexWrap="wrap"
          >
            <SocialLink href="https://blog.opencollective.com/" aria-label="Open Collective Blog link">
              <Blog size={16} />
            </SocialLink>
            <SocialLink href="https://twitter.com/opencollect" aria-label="Open Collective Twitter link">
              <Twitter size={16} />
            </SocialLink>
            <SocialLink href="https://github.com/opencollective" aria-label="Open Collective Github link">
              <Github size={16} />
            </SocialLink>
            <SocialLink href="https://slack.opencollective.com" aria-label="Open Collective Slack link">
              <Slack size={16} />
            </SocialLink>
            <SocialLink as={Link} href="/contact" aria-label="Contact Open Collective">
              <Mail size={16} />
            </SocialLink>
          </Container>
        </Flex>
        <Flex
          width={[1, null, null, null, '804px']}
          as="nav"
          flexWrap="wrap"
          justifyContent="center"
          mt={3}
          mx={[null, 3]}
          flex={['1 1 auto', null, null, null, 'none']}
        >
          {Object.keys(navigation).map(key => (
            <Box key={key} width={[0.5, 0.25]} mb={3}>
              <P
                textAlign={['center', 'left']}
                fontSize="14px"
                fontWeight="500"
                lineHeight="16px"
                color="black.800"
                letterSpacing="0.8px"
                textTransform="uppercase"
                mb={3}
              >
                {intl.formatMessage(messages[key])}
              </P>
              <FlexList justifyContent="center" flexDirection="column" pl={0} pr={2}>
                {Object.keys(navigation[key]).map(item =>
                  !LoggedInUser || (LoggedInUser && !(item === 'signup' || item === 'login')) ? (
                    <ListItem key={item} textAlign={['center', 'left']} mb={2}>
                      {navigation[key][item][0] === '/' ? (
                        <Link href={navigation[key][item]}>
                          <MenuLink as={Container}>
                            {messages[`${key}.${item}`] ? intl.formatMessage(messages[`${key}.${item}`]) : item}
                          </MenuLink>
                        </Link>
                      ) : (
                        <MenuLink href={navigation[key][item]}>
                          {messages[`${key}.${item}`] ? intl.formatMessage(messages[`${key}.${item}`]) : item}
                        </MenuLink>
                      )}
                    </ListItem>
                  ) : null,
                )}
              </FlexList>
            </Box>
          ))}
        </Flex>
        <Container
          width={1}
          color="#6E747A"
          textAlign={['center', 'left']}
          mt={3}
          mx={3}
          display={['none', 'block', null, null, 'none']}
        >
          <P as="div" pb={2} pt={2} textTransform="uppercase">
            <TranslateIcon />
            <Span
              mx={2}
              style={{ verticalAlign: 'middle' }}
              fontSize="10px"
              fontWeight="600"
              color="black.800"
              lineHeight="15px"
              letterSpacing="0.8px"
              textTransform="uppercase"
            >
              <FormattedMessage id="footer.changeLanguage" defaultMessage="change language" />
            </Span>
            <StyledTooltip
              content={() => (
                <FormattedMessage
                  id="Footer.Languages.JoinEffort"
                  defaultMessage="No technical skill is required to contribute to translations. You can join the effort on {crowdinLink} 🌐"
                  values={{
                    crowdinLink: (
                      <StyledLink href="https://crowdin.com/project/opencollective" openInNewTab>
                        Crowdin
                      </StyledLink>
                    ),
                  }}
                />
              )}
            >
              <InfoCircle size={16} />
            </StyledTooltip>
          </P>
          <Container width={['230px']} my={2}>
            <StyledSelect
              inputId="language-switcher"
              data-cy="language-switcher"
              options={languageOptions}
              onChange={({ value }) => switchLanguage(value)}
              defaultValue={defaultLanguage}
              menuPlacement="auto"
              formatOptionLabel={formatLanguageOptionLabel}
            />
          </Container>
        </Container>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
