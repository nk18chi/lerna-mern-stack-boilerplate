'use client';

import * as React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@nk18chi/components';
import { useRouter } from 'next/navigation';
import { Cancel } from '@mui/icons-material/';
import { useSession } from 'next-auth/react';
import graphqlClient from '@/service/graphqlClient';
import { CREATE_ARTICLE, REMOVE_ARTICLE, UPDATE_ARTICLE } from '@/gql/article';
import { UpdateArticleFilter } from '@/gql/types';
import { ArticleAction } from '@/enum/article.enum';

interface IArticleFormInput {
  title: string;
  content: string;
  published: boolean;
}

type IArticleFormProps = ICreateArticleFormProps | IUpdateArticleFormProps;

interface ICreateArticleFormProps {
  type: ArticleAction.CREATE;
}

interface IUpdateArticleFormProps {
  type: ArticleAction.UPDATE;
  defaultValues: IArticleFormInput;
  filter: UpdateArticleFilter;
}

export default function ArticleForm(props: IArticleFormProps) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IArticleFormInput>({
    defaultValues:
      props.type === ArticleAction.UPDATE ? props.defaultValues : {},
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const [requestErrors, setRequestErrors] = React.useState<string[]>([]);
  const client = graphqlClient(session?.accessToken);
  const onSubmit: SubmitHandler<IArticleFormInput> = React.useCallback(
    async (data) => {
      setIsSubmitting(true);
      let res: any;
      switch (props.type) {
        case ArticleAction.CREATE:
          res = await client.request(CREATE_ARTICLE, {
            input: data,
          });
          break;
        case ArticleAction.UPDATE:
          await client.request(UPDATE_ARTICLE, {
            filter: props.filter,
            input: data,
          });
          break;
      }
      if (res?.error) {
        setRequestErrors([res.error]);
        setIsSubmitting(false);
        return;
      }
      router.push('/');
      setIsSubmitting(false);
    },
    [props, client, router, setRequestErrors],
  );

  const onDelete = React.useCallback(async () => {
    if (props.type !== ArticleAction.UPDATE) {
      setRequestErrors(["Can't delete the article"]);
      return;
    }
    setIsSubmitting(true);
    try {
      await client.request(REMOVE_ARTICLE, {
        removeArticleId: props.filter.id,
      });
      router.push('/');
    } catch (e: any) {
      setRequestErrors([e.message]);
    }
    setIsSubmitting(false);
  }, [props, client, router, setRequestErrors]);

  return (
    <React.Fragment>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        noValidate
        sx={{ mt: 2 }}
      >
        <TextField
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 5,
              message: 'min length is 5',
            },
          })}
          autoFocus
          fullWidth
          label="Title"
          margin="normal"
          name="title"
          required
          error={!!errors.title}
          helperText={!!errors.title ? errors.title.message : ''}
        />
        <TextField
          {...register('content', {
            required: 'Content is required',
            minLength: {
              value: 20,
              message: 'min length is 20',
            },
          })}
          multiline
          rows={5}
          fullWidth
          required
          name="content"
          label="content"
          type="text"
          margin="normal"
          error={!!errors.content}
          helperText={!!errors.content ? errors.content.message : ''}
        />
        <FormGroup>
          <FormControlLabel
            label="Published"
            control={
              <Checkbox
                defaultChecked={
                  props.type === ArticleAction.UPDATE
                    ? props.defaultValues.published
                    : true
                }
                {...register('published')}
              />
            }
          />
        </FormGroup>
        {requestErrors.map((error, i) => (
          <Box component="p" key={i} sx={{ color: 'error.main' }}>
            <Cancel sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            {error}
          </Box>
        ))}
        <Box component="div" className="flex justify-around">
          <Button
            type="button"
            color="light"
            variant="contained"
            size="large"
            sx={{ minWidth: 200, mt: 2 }}
            label={isSubmitting ? 'In progress…' : 'Delete'}
            disabled={isSubmitting}
            onClick={onDelete}
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            size="large"
            sx={{ minWidth: 200, mt: 2 }}
            label={isSubmitting ? 'In progress…' : 'Save'}
            disabled={isSubmitting}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
