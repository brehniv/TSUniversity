function round2(number: number): number {
    const roundedNumber = number.toFixed(2);
    return parseFloat(roundedNumber);
}

type TriangleType = "leg" | "hypotenuse" | "adjacent angle" | "opposite angle" | "angle";

function triangle(value1: number, type1: TriangleType, value2: number, type2: TriangleType): string {
    // Перевірка на некоректність уведених значень
    if (value1 <= 0.01 || value2 <= 0.01|| isNaN(value1) || isNaN(value2)) {
        return "failed: value must be positive or bigger";
    }

    const validTypes: TriangleType[] = [
        "leg",
        "hypotenuse",
        "adjacent angle",
        "opposite angle",
        "angle",
    ];
    const anglesList: TriangleType[] = ["adjacent angle", "opposite angle", "angle"];
    
    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        return "failed: input types error";
    }

    if (
        (type1 === "hypotenuse" && type2 === "leg") ||
        (type1 === "leg" && type2 === "hypotenuse")
    ) {
        if (value1 === value2) {
            return "failed: hypotenuse cannot be equal to leg";
        }
    }

    if (anglesList.includes(type1)) {
        if (value1 < 0 || value1 > 90) {
            return `failed: incorrect angle ${type1}`;
        }
    }

    if (anglesList.includes(type2)) {
        if (value2 < 0 || value2 > 90) {
            return `failed: incorrect angle ${type2}`;
        }
    }

    if (type1 === "hypotenuse" && type2 === "hypotenuse") {
        return "failed: 2 hypotenuses in triangle";
    }

    let a: number = 0, b: number = 0, c: number = 0, alpha: number = 0, beta: number = 0;

    switch (type1) {
        case "leg":
            {
                a = value1;
                switch (type2) {
                    case "leg": {
                        b = value2;
                        c = Math.sqrt(a ** 2 + b ** 2);
                        alpha = Math.atan(a / b) * (180 / Math.PI);
                        beta = 90 - alpha;
                        break;
                    }
                    case "hypotenuse": {
                        if (a > value2) return "failed: hypotenuse smaller than leg";
                        c = value2;
                        b = Math.sqrt(c ** 2 - a ** 2);
                        alpha = Math.atan(a / b) * (180 / Math.PI);
                        beta = 90 - alpha;
                        break;
                    }
                    case "adjacent angle": {
                        alpha = value2;
                        c = a / Math.cos(alpha * (Math.PI / 180));
                        b = Math.sqrt(c ** 2 - a ** 2);
                        beta = 90 - alpha;
                        break;
                    }
                    case "opposite angle": {
                        beta = value2;
                        c = a / Math.sin(beta * (Math.PI / 180));
                        b = Math.sqrt(c ** 2 - a ** 2);
                        alpha = 90 - beta;
                        break;
                    }
                }
            }
            break;
        case "hypotenuse":
            {
                c = value1;
                switch (type2) {
                    case "leg": {
                        if (c < value2) {
                            return "failed: hypotenuse smaller than leg";
                        }
                        a = value2;
                        b = Math.sqrt(c ** 2 - a ** 2);
                        alpha = Math.atan(a / b) * (180 / Math.PI);
                        beta = 90 - alpha;
                        break;
                    }
                    case "angle": {
                        alpha = value2;
                        beta = 90 - alpha;
                        b = c * Math.sin(beta * (Math.PI / 180));
                        a = Math.sqrt(c ** 2 - b ** 2);
                        break;
                    }
                }
            }
            break;
        case "opposite angle":
            {
                alpha = value1;
                beta = 90 - alpha;
                switch (type2) {
                    case "leg": {
                        a = value2;
                        c = a / Math.cos(alpha * (Math.PI / 180));
                        b = Math.sqrt(c ** 2 - a ** 2);
                        break;
                    }
                    case "hypotenuse": {
                        c = value2;
                        b = c * Math.sin(beta * (Math.PI / 180));
                        a = Math.sqrt(c ** 2 - b ** 2);
                        break;
                    }
                }
            }
            break;
        case "adjacent angle":
            {
                alpha = value1;
                beta = 90 - alpha;
                switch (type2) {
                    case "leg": {
                        a = value2;
                        c = a / Math.cos(alpha * (Math.PI / 180));
                        b = Math.sqrt(c ** 2 - a ** 2);
                        break;
                    }
                    case "hypotenuse": {
                        c = value2;
                        b = c * Math.sin(beta * (Math.PI / 180));
                        a = Math.sqrt(c ** 2 - b ** 2);
                        break;
                    }
                }
            }
            break;
        case "angle":
            {
                beta = value1;
                switch (type2) {
                    case "hypotenuse":
                        c = value2;
                        b = c * Math.sin(beta * (Math.PI / 180));
                        a = Math.sqrt(c ** 2 - b ** 2);
                        alpha = 90 - beta;
                        break;
                }
            }
            break;
    }

    if (beta <= 0.01 || alpha <= 0.01) {
        return "failed: after calculation angle smaller than or equal to zero";
    }

    console.log(
        `a = ${round2(a)}\nb = ${round2(b)}\nc = ${round2(c)}\nalpha = ${round2(alpha)}°\nbeta = ${round2(beta)}°`
    );

    return "success";
}
