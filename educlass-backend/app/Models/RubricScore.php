<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RubricScore extends Model
{
    /**
     * Get the submission answer that the rubric score belongs to.
     */
    public function submissionAnswer(): BelongsTo
    {
        return $this->belongsTo(SubmissionAnswer::class);
    }

    /**
     * Get the rubric criteria that the rubric score belongs to.
     */
    public function rubricCriteria(): BelongsTo
    {
        return $this->belongsTo(RubricCriteria::class);
    }
}
