import { FC, useMemo, useState, useEffect } from 'react';
import styles from './AkinatorPage.module.scss';
import { bindStyles } from '@/utils';
import WaveBackground, { WaveBackgroundVariant } from '@/components/WaveBackground/WaveBackground.tsx';
import { Button, ButtonVariants, Input } from '@/components';

const cx = bindStyles(styles);

export enum AkinatorSteps {
  START = 'start',
  QUESTIONS = 'questions',
  ANSWER = 'answer',
  GOOD_ANSWER = 'goodAnswer',
  BAD_ANSWER = 'badAnswer',
}

interface AnimalNode {
  type: 'animal';
  name: string;
  yes: undefined;
  no: undefined;
}

enum AnswerVariants {
  YES = 'yes',
  NO = 'no',
}

interface QuestionNode {
  type: 'question';
  question: string;
  yes: TreeNode;
  no: TreeNode;
}

type TreeNode = AnimalNode | QuestionNode;

const initialKnowledgeBase: TreeNode = {
  type: 'question',
  question: 'Большой?',
  yes: { type: 'animal', name: 'Слон', yes: undefined, no: undefined },
  no: { type: 'animal', name: 'Мышь', yes: undefined, no: undefined }
};

export const AkinatorPage: FC = () => {
  // Загружаем данные из localStorage при монтировании
  const [knowledge, setKnowledge] = useState<TreeNode>(() => {
    const savedData = localStorage.getItem('knowledgeBase');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return initialKnowledgeBase;
  });

  const [step, setStep] = useState(AkinatorSteps.START);
  const [animalName, setAnimalName] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [history, setHistory] = useState<AnswerVariants[]>([]);
  const [currentNode, setCurrentNode] = useState<TreeNode | undefined>(knowledge);

  // Сохраняем изменения базы знаний при каждом обновлении
  useEffect(() => {
    localStorage.setItem('knowledgeBase', JSON.stringify(knowledge));
  }, [knowledge]);

  const handleClickNextStep = () => {
    switch (step) {
      case AkinatorSteps.START:
        setStep(AkinatorSteps.QUESTIONS);
        break;
      default:
        setStep(AkinatorSteps.START);
        break;
    }
  }

  const handleClickAnswer = (answer: AnswerVariants) => {
    if (currentNode && currentNode.type === 'question') {
      setHistory((prev) => [...prev, answer]);
      const nextNode = answer === AnswerVariants.YES ? currentNode.yes : currentNode.no;
      setCurrentNode(nextNode);
      if (nextNode?.type === 'animal') {
        setStep(AkinatorSteps.ANSWER);
      }
    }
  }

  const handleClickFinalAnswer = (answer: AnswerVariants) => {
    if (answer === AnswerVariants.YES) {
      setStep(AkinatorSteps.GOOD_ANSWER);
    } else {
      setStep(AkinatorSteps.BAD_ANSWER);
    }
  }

  const playAgain = () => {
    setStep(AkinatorSteps.START);
    setCurrentNode(knowledge);
    setHistory([]);
  }

  const handleClickReady = () => {
    if (!animalName || !question) {
      return;
    }

    const newKnowledge = JSON.parse(JSON.stringify(knowledge));

    let prevNode: TreeNode | undefined = newKnowledge;

    history.forEach(hItem => {
      if (prevNode && prevNode.type === 'question') {
        prevNode = hItem === AnswerVariants.YES ? prevNode.yes : prevNode.no;
      }
    });

    if (prevNode && prevNode.type === 'animal') {
      // Нам нужно найти родителя последнего узла-ответа, чтобы заменить его на новый вопрос.
      // История хранит последовательность ответов. Нужно пройти по ней заново, кроме последнего шага,
      // чтобы найти родительский узел вопроса.

      let parentNode: QuestionNode | undefined = newKnowledge as QuestionNode;
      let parentAnswer: AnswerVariants | undefined;

      // Пройдемся по истории, кроме последнего ответа
      for (let i = 0; i < history.length - 1; i++) {
        const h = history[i];
        if (parentNode.type === 'question') {
          parentNode = h === AnswerVariants.YES ? parentNode.yes as QuestionNode : parentNode.no as QuestionNode;
        }
      }

      // Последний ответ нам нужен для того, чтобы понять, какую ветку у родителя менять
      parentAnswer = history[history.length - 1];

      // Ветка, которую нужно заменить у parentNode
      if (parentNode && parentNode.type === 'question') {
        const oldAnimal = parentAnswer === AnswerVariants.YES ? parentNode.yes : parentNode.no;

        const newNode: QuestionNode = {
          type: 'question',
          question: question,
          yes: {
            type: 'animal',
            name: animalName,
            yes: undefined,
            no: undefined
          },
          no: oldAnimal
        };

        if (parentAnswer === AnswerVariants.YES) {
          parentNode.yes = newNode;
        } else {
          parentNode.no = newNode;
        }
      }

      setKnowledge(newKnowledge);
      setHistory([]);
      setStep(AkinatorSteps.START);
      setAnimalName('');
      setQuestion('');
      setCurrentNode(newKnowledge);
    } else {
      // Если prevNode - вопрос или не найден, логика может быть другой,
      // но для упрощения оставим так.
    }
  }

  const renderedButtons = useMemo(() => {
    switch (step) {
      case AkinatorSteps.START:
        return <Button text="Начнем" onClick={handleClickNextStep} variant={ButtonVariants.BLUR} />
      case AkinatorSteps.QUESTIONS:
        return (
          <div className={cx('buttons')}>
            <Button text="Нет" onClick={() => handleClickAnswer(AnswerVariants.NO)} variant={ButtonVariants.BLUR} />
            <Button text="Да" onClick={() => handleClickAnswer(AnswerVariants.YES)} variant={ButtonVariants.BLUR} />
          </div>
        )
      case AkinatorSteps.ANSWER:
        return (
          <div className={cx('buttons')}>
            <Button text="Нет" onClick={() => handleClickFinalAnswer(AnswerVariants.NO)} variant={ButtonVariants.BLUR} />
            <Button text="Да" onClick={() => handleClickFinalAnswer(AnswerVariants.YES)} variant={ButtonVariants.BLUR} />
          </div>
        )
      case AkinatorSteps.GOOD_ANSWER:
        return (
          <div className={cx('buttons')}>
            <Button text="Давай" onClick={() => playAgain()} variant={ButtonVariants.BLUR} />
          </div>
        )
      case AkinatorSteps.BAD_ANSWER:
        return (
          <div className={cx('buttons')}>
            <Button text="Готово" onClick={handleClickReady} variant={ButtonVariants.BLUR} />
          </div>
        )
    }
  }, [step, handleClickNextStep, handleClickReady, handleClickAnswer, playAgain]);

  const text = useMemo(() => {
    switch (step) {
      case AkinatorSteps.START:
        return 'Здравствуйте, давайте я попробую отгадать животное, которое вы загадали?';
      case AkinatorSteps.QUESTIONS:
        return currentNode?.type === 'question' ? currentNode?.question : currentNode?.name;
      case AkinatorSteps.ANSWER:
        return `${currentNode?.type === 'animal'? currentNode?.name : currentNode?.question}?`;
      case AkinatorSteps.GOOD_ANSWER:
        return `Ура, я угадал! Сыграем еще раз?`;
      case AkinatorSteps.BAD_ANSWER:
        return `Я не знаю это животное. Пожалуйста, введите новое животное и вопрос, который отличает его от известного.`;
      default:
        return '';
    }
  }, [step, currentNode]);

  const variant = useMemo(() => {
    switch (step) {
      case AkinatorSteps.GOOD_ANSWER:
        return WaveBackgroundVariant.GOOD;
      case AkinatorSteps.BAD_ANSWER:
        return WaveBackgroundVariant.BAD;
      default:
        return WaveBackgroundVariant.DEFAULT;
    }
  }, [step]);

  console.log(variant)

  return (
    <div className={cx('game-page')}>
      <WaveBackground text={text} variant={variant}>
        {step === AkinatorSteps.BAD_ANSWER && (
          <div className={cx('inputs')}>
            <Input value={animalName} onChange={setAnimalName} placeholder="Новое животное (например, 'Кит')" />
            <Input value={question} onChange={setQuestion} placeholder="Отличительный признак в форме вопроса (например, 'Водное?')" />
          </div>
        )}
        {renderedButtons}
      </WaveBackground>
    </div>
  );
}
