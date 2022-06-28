import React from 'react';
import PropTypes from 'prop-types';
import { Check } from '@styled-icons/fa-solid/Check';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { addAuthTokenToHeader } from '../../lib/api';
import { ERROR, formatErrorType } from '../../lib/errors';
import { useAsyncCall } from '../../lib/hooks/useAsyncCall';
import useLoggedInUser from '../../lib/hooks/useLoggedInUser';

import Avatar from '../Avatar';
import Container from '../Container';
import { Box, Flex } from '../Grid';
import Image from '../Image';
import LinkCollective from '../LinkCollective';
import Loading from '../Loading';
import MessageBox from '../MessageBox';
import RadialIconContainer from '../RadialIconContainer';
import StyledButton from '../StyledButton';
import StyledCard from '../StyledCard';
import { P } from '../Text';

const TopAvatarsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -48px;
  left: 0;
  width: 100%;
  gap: 28px;
`;

const fetchAuthorize = (application, redirectUri = null, state = null) => {
  const authorizeParams = new URLSearchParams({
    /* eslint-disable camelcase */
    response_type: 'code',
    client_id: application.clientId,
    redirect_uri: redirectUri || application.redirectUri,
    state,
    /* eslint-enable camelcase */
  });

  return fetch(`/api/oauth/authorize?${authorizeParams.toString()}`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      ...addAuthTokenToHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const getAdministratedAccounts = user => {
  return uniqBy(
    user.memberOf.filter(m => m.role === 'ADMIN' && !m.collective?.isIncognito).map(m => m.collective),
    'id',
  );
};

export const ApplicationApproveScreen = ({ application, redirectUri, autoApprove, state }) => {
  const { LoggedInUser } = useLoggedInUser();
  const intl = useIntl();
  const router = useRouter();
  const [isRedirecting, setRedirecting] = React.useState(autoApprove);
  const administratedAccounts = getAdministratedAccounts(LoggedInUser);
  const {
    call: callAuthorize,
    loading,
    error,
  } = useAsyncCall(async () => {
    let response = null;
    try {
      response = await fetchAuthorize(application, redirectUri, state);
    } catch {
      setRedirecting(false); // To show errors with autoApprove
      throw formatErrorType(intl, ERROR.NETWORK);
    }

    const body = await response.json();
    if (response.ok) {
      setRedirecting(true);
      return router.push(body['redirect_uri']);
    } else {
      setRedirecting(false); // To show errors with autoApprove
      throw new Error(body['error_description'] || body['error']);
    }
  });

  React.useState(() => {
    if (autoApprove) {
      callAuthorize();
    }
  }, []);

  return (
    <Container position="relative" mt="48px">
      <StyledCard maxWidth="520px" width="100%" px={24} py={32} m="0 auto">
        <TopAvatarsContainer>
          <Container size={96} bg="white.full" borderRadius="100%">
            <LinkCollective collective={application.account}>
              <Avatar size={96} collective={application.account} border="1px solid #DCDEE0" />
            </LinkCollective>
          </Container>
          <RadialIconContainer size="32px" bg="#29cc75">
            <Check size={12} />
          </RadialIconContainer>
          <Container borderRadius="50%" border="1px solid #DCDEE0">
            <RadialIconContainer size={96} bg="blue.700">
              <Image src="/static/images/oc-logo-inverted.svg" height={56} width={56} />
            </RadialIconContainer>
          </Container>
        </TopAvatarsContainer>
        <Box pt={56}>
          {isRedirecting ? (
            <Flex flexDirection="column" justifyContent="center" alignItems="center" pb={3}>
              <P fontSize="16px" fontWeight="500" mb={4}>
                <FormattedMessage defaultMessage="Redirecting…" />
              </P>
              <Loading />
            </Flex>
          ) : (
            <React.Fragment>
              <P fontWeight="700" fontSize="24px" textAlign="center" color="black.900" mb={32}>
                <FormattedMessage
                  defaultMessage="{applicationName} wants permission to:"
                  values={{ applicationName: application.name }}
                />
              </P>
              <Flex alignItems="center">
                <Avatar collective={LoggedInUser.collective} size={48} />
                <P fontSize="18px" color="black.700" ml={3}>
                  <FormattedMessage
                    defaultMessage="Verify your identity on {service}"
                    values={{ service: 'Open Collective' }}
                  />{' '}
                  <strong>({LoggedInUser.collective.name})</strong>
                </P>
              </Flex>
              <Flex alignItems="center" mt={26}>
                <Avatar
                  size={48}
                  title={administratedAccounts.map(a => a.name).join(', ')}
                  collective={administratedAccounts[0]}
                />
                <P fontSize="18px" color="black.700" ml={3}>
                  <FormattedMessage defaultMessage="Access information about your Collective(s)" />
                </P>
              </Flex>
              <Flex alignItems="center" mt={26}>
                <Image src="/static/images/stars-exchange-rounded.png" width={48} height={48} />
                <P fontSize="18px" color="black.700" ml={3}>
                  <FormattedMessage defaultMessage="Perform admin actions on your behalf" />
                </P>
              </Flex>
              <MessageBox type="info" mt={40} fontSize="13px">
                <FormattedMessage
                  defaultMessage="By authorizing {applicationName} you are giving access to all your Collectives."
                  values={{ applicationName: application.name }}
                />
              </MessageBox>
              {error && (
                <MessageBox type="error" withIcon mt={3}>
                  {error.toString()}
                </MessageBox>
              )}
            </React.Fragment>
          )}
        </Box>
      </StyledCard>
      {!isRedirecting && (
        <Flex mt={24} justifyContent="center" gap="24px">
          <StyledButton minWidth={175} onClick={() => window.history.back()} disabled={loading}>
            <FormattedMessage id="actions.cancel" defaultMessage="Cancel" />
          </StyledButton>
          <StyledButton minWidth={175} buttonStyle="primary" loading={loading || isRedirecting} onClick={callAuthorize}>
            <FormattedMessage defaultMessage="Authorize" />
          </StyledButton>
        </Flex>
      )}
    </Container>
  );
};

ApplicationApproveScreen.propTypes = {
  application: PropTypes.shape({
    name: PropTypes.string,
    clientId: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    account: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  redirectUri: PropTypes.string,
  state: PropTypes.string,
  autoApprove: PropTypes.bool,
};
