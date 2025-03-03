import React from 'react';
import { CheckCircle } from '@styled-icons/fa-solid/CheckCircle';
import { ExclamationCircle } from '@styled-icons/fa-solid/ExclamationCircle';
import { ExclamationTriangle } from '@styled-icons/fa-solid/ExclamationTriangle';
import { InfoCircle } from '@styled-icons/fa-solid/InfoCircle';
import { themeGet } from '@styled-system/theme-get';
import styled from 'styled-components';
import {
  borders,
  BordersProps,
  color,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

import { whiteSpace, WhiteSpaceProps } from '../lib/styled-system-custom-properties';
import { MessageType, messageType } from '../lib/theme/variants/message';

import { Box, Flex } from './Grid';
import StyledSpinner from './StyledSpinner';

type MessageProps = BordersProps &
  ShadowProps &
  DisplayProps &
  LayoutProps &
  SpaceProps &
  TypographyProps &
  FlexboxProps &
  WhiteSpaceProps & {
    type: MessageType;
  };

type MessageBoxProps = MessageProps & {
  isLoading?: boolean;
  withIcon?: boolean;
  children: React.ReactNode;
};

const Message = styled.div<MessageProps>`
  border: 0.6px solid;
  border-radius: 12px;
  padding: ${themeGet('space.3')}px 24px;
  font-size: 13px;
  line-height: 20px;

  box-shadow: 0px 1px 4px 1px rgba(49, 50, 51, 0.05);

  ${borders}
  ${shadow}
  ${display}
  ${layout}
  ${space}
  ${typography}
  ${color}
  ${flexbox}
  ${whiteSpace}

  ${messageType}

  a {
    text-decoration: underline !important;
    color: ${themeGet('colors.black.800')};
  }
  h1,
  h2,
  h3,
  h4 {
    font-size: 13px;
    margin: 0 0 8px 0;
    font-weight: 700;
  }
  svg[data-type='message-icon'] {
    vertical-align: text-bottom;
  }
`;

const iconColors = {
  white: 'black.600',
  info: 'blue.500',
  success: 'green.500',
  warning: 'yellow.600',
  error: 'red.500',
};

const icons = {
  info: <InfoCircle data-type="message-icon" size="1.1em" color="inherit" />,
  success: <CheckCircle data-type="message-icon" size="1.1em" />,
  warning: <ExclamationTriangle data-type="message-icon" size="1.1em" />,
  error: <ExclamationCircle data-type="message-icon" size="1.1em" />,
};

/**
 * Display messages in a box contextualized for message type (error, success...etc)
 */
const MessageBox = ({ type = 'white', withIcon = false, isLoading, children, ...props }: MessageBoxProps) => {
  const icon = withIcon ? icons[type] : null;
  return (
    <Message type={type} {...props}>
      <Flex gap="16px">
        {(icon || isLoading) && (
          <Box flexShrink={0} alignSelf="start" color={iconColors[type]}>
            {isLoading ? <StyledSpinner size="1.2em" /> : icon}
          </Box>
        )}

        <Box flex={1}>{children}</Box>
      </Flex>
    </Message>
  );
};

export default MessageBox;
