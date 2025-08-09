import React from 'react';
import { useLocation } from 'react-router-dom';
import ScrollProgressBar from './ScrollProgressBar';

const HIDDEN_PATHS = ['/signin', '/signup','/help', '/reset-password', '/forgot-password'];

const ScrollProgressController = () => {
  const location = useLocation();
  const shouldHide = HIDDEN_PATHS.includes(location.pathname);
  if (shouldHide) return null;
  return <ScrollProgressBar />;
};

export default ScrollProgressController;
