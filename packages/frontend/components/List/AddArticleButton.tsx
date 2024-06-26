'use client';

import * as React from 'react';
import { Button } from '@nk18chi/components';

export default function AddArticleButton() {
  return (
    <Button
      color="secondary"
      variant="contained"
      size="large"
      component="a"
      href="/article/add"
      sx={{ minWidth: 200 }}
      label="Add Article"
    />
  );
}
