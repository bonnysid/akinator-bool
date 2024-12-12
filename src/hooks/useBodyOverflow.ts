import { useEffect, useRef } from 'react';
import { v4 } from 'uuid';

const ATTR = 'active-modal';

const body = document.body;

const setOverflow = (value: string) => (body.style.overflowY = value);

const useBodyOverflow = (condition: boolean, lock = true) => {
  const refId = useRef<string>(v4());

  const onAdd = (id: string) => {
    const attr = body.getAttribute(ATTR);

    if (attr) {
      const ids = attr.split(',');
      ids.push(id);
      body.setAttribute(ATTR, ids.join(','));
    } else {
      body.setAttribute(ATTR, id);
    }

    setOverflow('hidden');
  };

  const onRemove = (id: string) => {
    const attr = body.getAttribute(ATTR);

    if (attr) {
      let ids = attr.split(',');
      ids = ids.filter((val) => val !== id);
      body.setAttribute(ATTR, ids.join(','));

      if (ids.length === 0) {
        setOverflow('');
        body.removeAttribute(ATTR);
      }
    }
  };

  useEffect(() => {
    if (!lock) {
      return;
    }

    if (condition) {
      onAdd(refId.current);
    } else {
      onRemove(refId.current);
    }

    return () => {
      onRemove(refId.current);
    };
  }, [condition]);
};

export { useBodyOverflow };
