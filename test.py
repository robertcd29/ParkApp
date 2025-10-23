import os
from ultralytics import YOLO

runs_folder = "C:/Unihack2025/ObDetector/venv/runs/detect"
test_images_folder = "C:/Unihack2025/ObDetector/venv/test_images"
output_folder = "C:/Unihack2025/ObDetector/venv/test_results"
os.makedirs(output_folder, exist_ok=True)

train_folders = [f for f in os.listdir(runs_folder) if f.startswith("train")]
train_folders.sort()
if not train_folders:
    raise ValueError(f"Niciun folder 'train' găsit în {runs_folder}")

last_train = train_folders[-1]
model_path = os.path.join(runs_folder, last_train, "weights", "best.pt")

if not os.path.isfile(model_path):
    raise FileNotFoundError(f"Modelul {model_path} nu există!")

print(f"✅ Folosește modelul: {model_path}")

model = YOLO(model_path)

print("🔎 Clase disponibile în model:")
print(model.names)

image_files = [f for f in os.listdir(test_images_folder)
               if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

if not image_files:
    raise ValueError(f"Nicio imagine găsită în {test_images_folder}")

for img_file in image_files:
    image_path = os.path.join(test_images_folder, img_file)
    print(f"\n🔍 Analizează imaginea: {image_path}")

    results = model.predict(source=image_path, conf=0.5, save=True,
                            project=output_folder, name='')

    free_count = 0
    total_count = 0

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            class_name = model.names[cls]
            print(f"→ Detectat: {class_name}")
            total_count += 1

            # Numără locurile libere
            if class_name.lower() == "empty":  # corect pentru modelul tău
                free_count += 1

    print(f"🟢 Locuri libere detectate în '{img_file}': {free_count} din {total_count} totale")

print("\n✅ Analiza imaginilor a fost finalizată!")
