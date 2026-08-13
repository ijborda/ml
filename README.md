This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Marito Or Not

### Train locally

Model training runs locally rather than in Docker to avoid container memory limits. Use Python 3.10 so the exported FastAI model is compatible with the API container.

Initialize Conda and create the training environment:

```bash
sudo /opt/homebrew/bin/conda init zsh
conda create --name deeplearning-notes python=3.10
conda activate deeplearning-notes
```

Install the training dependencies:

```bash
conda install -c ipykernel --update-deps --force-reinstall
conda install -c pytorch pytorch torchvision torchaudio -y
conda install -c fastchan fastai -y
pip install -U duckduckgo-search
```

### Model environment compatibility

FastAI exports serialize parts of the learner and its transform pipeline. The training environment that creates `marito-or-not.pkl` must use the same Python and ML package versions as the API container that loads it. A mismatch can cause incorrect or nondeterministic inference behavior.

The current compatible versions are:

```text
Python: 3.10
FastAI: 2.8.7
PyTorch: 2.5.1
Torchvision: 0.20.1
```

Check the local training environment before exporting a model:

```bash
python -c "import fastai, torch, torchvision; print({'fastai': fastai.__version__, 'torch': torch.__version__, 'torchvision': torchvision.__version__})"
```

The API versions are pinned in `ml-api/requirements.txt`; update the API dependencies and rebuild the container whenever the training environment changes.

Confirm that the active environment uses Python 3.10, place training images in `data/marito-or-not/marito` and `data/marito-or-not/not-marito`, then train the model:

```bash
python --version
# Expected: Python 3.10.x

python ml-train/marito-or-not.py
```

The export is written to `ml-api/models/marito-or-not.pkl`. When finished, leave the environment with `conda deactivate`.

### Run the application

```bash
docker compose up --build
```

The deployment publishes only port `3000` for the web application. The ML API has no host port mapping and is reachable only by the web container at `http://ml-api:8000` on the internal Compose network.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
